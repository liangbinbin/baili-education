const API_BASE = '/api';

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

const AppState = {
  token: null,
  currentUser: null,
  allHomeworks: [],
  allCourses: [],
  currentHomework: null,
  uploadedFiles: [],
  expandedHomeworks: {},
  expandedCheckinHomeworks: {},
  lastMakeupLocation: {},
  currentUploadHomework: null,
  dataCache: null,
  cacheTime: 0,
  CACHE_DURATION: 30000,
  isEventBound: false,
  modules: {
    homework: null,
    checkin: null
  }
};

const EventBus = {
  listeners: {},
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  },
  
  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  },
  
  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function loadModules() {
  try {
    const [homeworkExport, checkinExport] = await Promise.all([
      import('./homework-module.js'),
      import('./checkin-module.js')
    ]);
    AppState.modules.homework = homeworkExport;
    AppState.modules.checkin = checkinExport;
    console.log('✅ Modules loaded successfully');
  } catch (e) {
    console.error('❌ Failed to load modules:', e);
  }
}

function toggleCycles(homeworkId) {
  const list = document.getElementById(`cyclesList-${homeworkId}`);
  const icon = document.getElementById(`toggleIcon-${homeworkId}`);
  if (list) {
    const isHidden = list.style.display === 'none';
    list.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.textContent = isHidden ? '▲' : '▼';
    
    if (isHidden) {
      list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function handleHomeworkAction(homeworkId) {
  const h = AppState.allHomeworks.find(item => item._id === homeworkId);
  if (!h) return;
  
  const isSingleHomework = h.cycle?.type !== 'multi';
  
  if (isSingleHomework) {
    if (h.cyclesData && h.cyclesData[0] && h.cyclesData[0].times[0]) {
      openUploadModal(homeworkId, 0, 0);
    }
  } else {
    locateAndHighlightIncomplete(homeworkId);
  }
}

function openHomeworkShareModal(homeworkId) {
  const h = AppState.allHomeworks.find(item => item._id === homeworkId);
  if (!h) return;

  const { cycles } = calculateCycles(h);
  const isSingleHomework = h.cycle?.type !== 'multi';
  const timesPerCycle = h.frequency?.timesPerCycle || 1;
  const totalTaskCount = isSingleHomework ? 1 : (timesPerCycle * cycles);
  const completedCycles = h.completedCycles || 0;
  const completedTimes = h.completedTimes || 0;
  const hasCheckin = h.hasCheckin === true;
  
  let canShare = false;
  if (hasCheckin) {
    canShare = completedTimes >= totalTaskCount;
  } else {
    canShare = isSingleHomework ? (completedTimes >= 1) : (completedCycles >= cycles);
  }

  let shareHtml = '';
  if (!canShare) {
    if (isSingleHomework) {
      shareHtml = `<div class="alert alert-warning">⚠️ 需要完成全部1次作业后才能分享</div>`;
    } else {
      const remaining = totalTaskCount - completedTimes;
      shareHtml = `<div class="alert alert-warning">⚠️ 需要完成全部${totalTaskCount}次作业后才能分享（还剩${remaining}次）</div>`;
    }
  } else {
    shareHtml = `
      <div class="alert alert-success">✅ 作业全部完成，可以分享！</div>
      <div class="share-options">
        <div class="share-option" onclick="shareToWechat('${homeworkId}', 'chat')">
          <div class="share-option-icon">💬</div>
          <div class="share-option-title">分享到微信聊天</div>
          <div class="share-option-desc">分享给朋友或群聊</div>
        </div>
      </div>`;
  }

  document.getElementById('shareContent').innerHTML = shareHtml;
  document.getElementById('shareModal').classList.add('show');
}

function getCheckinId(homeworkId) {
  if (homeworkId.startsWith('checkin-')) {
    return homeworkId;
  }
  return 'checkin-' + homeworkId;
}

function getRealId(id) {
  if (id.startsWith('checkin-')) {
    return id.substring('checkin-'.length);
  }
  return id;
}

function showStatus(msg, type) {
  const el = document.getElementById('statusMsg');
  if (el) {
    el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    setTimeout(() => { el.innerHTML = ''; }, 5000);
  }
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

async function apiRequest(url, options = {}, params = {}) {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const useProxy = !isLocalhost;
  
  if (useProxy) {
    console.log('代理环境检测，使用模拟数据');
    return getMockResponse(url, options, params);
  }
  
  const headers = { 'Content-Type': 'application/json' };
  if (AppState.token) headers['Authorization'] = `Bearer ${AppState.token}`;
  
  let fullUrl = url.startsWith('/') ? url : `${API_BASE}/${url}`;
  const queryParams = new URLSearchParams();
  for (const key in params) {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  }
  const queryString = queryParams.toString();
  if (queryString) {
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
  }
  
  try {
    console.log('API请求:', fullUrl);
    const response = await fetch(fullUrl, { ...options, headers, credentials: 'same-origin' });
    
    if (!response.ok) {
      console.log('API请求返回非200，使用模拟数据');
      return getMockResponse(url, options, params);
    }
    
    return await response.json();
  } catch (error) {
    console.log('API请求失败，使用模拟数据:', error.message);
    return getMockResponse(url, options, params);
  }
}

function getMockResponse(url, options, params) {
  if (url === 'batch/init') {
    return { code: 200, message: '获取成功', data: getEnhancedMockData() };
  } else if (url === 'auth/test-login') {
    const body = options.body ? JSON.parse(options.body) : {};
    return {
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-token-' + Date.now(),
        user: {
          id: 'user-mock',
          phone: body.phone || '13800138000',
          name: body.name || '测试用户',
          role: 'student',
          points: 175,
          gender: null,
          birthday: null,
          avatar: null,
          classIds: []
        }
      }
    };
  } else if (url === 'user/info') {
    return {
      code: 200,
      success: true,
      data: AppState.currentUser
    };
  } else if (url === 'course/list') {
    return {
      code: 200,
      success: true,
      data: AppState.allCourses
    };
  } else if (url === 'class/list') {
    return {
      code: 200,
      success: true,
      data: []
    };
  } else if (url === 'homework/list') {
    return {
      code: 200,
      success: true,
      data: AppState.allHomeworks
    };
  } else if (url === 'homework/submit') {
    const body = options.body ? JSON.parse(options.body) : {};
    return {
      code: 200,
      success: true,
      message: '作业提交成功',
      data: {
        submitted: true,
        cycleIndex: body.cycleIndex || 0,
        timeIndex: body.timeIndex || 0,
        isCompleted: true,
        earnedPoints: 10
      }
    };
  } else if (url === 'homework/share') {
    return {
      code: 200,
      success: true,
      message: '分享成功',
      data: { shared: true, earnedPoints: 10 }
    };
  } else if (url === 'checkin/stats') {
    return {
      code: 200,
      success: true,
      data: {
        totalCheckins: 15,
        currentStreak: 5,
        maxStreak: 10,
        todayCheckins: 1
      }
    };
  } else if (url === 'checkin/submit') {
    return {
      code: 200,
      success: true,
      message: '打卡成功',
      data: {
        checkin: { _id: 'checkin-' + Date.now() },
        pointsEarned: 5,
        currentStreak: 6,
        totalCheckins: 16
      }
    };
  } else if (url === 'points/my') {
    const points = AppState.currentUser?.points || 175;
    return {
      code: 200,
      success: true,
      data: {
        current: points,
        earned: points,
        spent: 0,
        history: points
      }
    };
  } else if (url === 'points/records') {
    return {
      code: 200,
      success: true,
      data: [
        { _id: '1', type: 'earn', source: 'homework', amount: 10, description: '完成作业', createdAt: new Date().toISOString() },
        { _id: '2', type: 'earn', source: 'checkin', amount: 5, description: '打卡奖励', createdAt: new Date().toISOString() }
      ],
      pagination: { page: 1, limit: 20, total: 2, pages: 1 }
    };
  } else if (url === 'points/ranking') {
    return {
      code: 200,
      success: true,
      data: {
        period: 'week',
        periodText: '本周',
        myPoints: 50,
        myRank: 3,
        ranking: [
          { rank: 1, name: '张三', totalPoints: 100, avatar: null },
          { rank: 2, name: '李四', totalPoints: 80, avatar: null },
          { rank: 3, name: AppState.currentUser?.name || '我', totalPoints: 50, avatar: null, isCurrentUser: true }
        ]
      }
    };
  }
  return { code: 200, success: true, data: null };
}

function getEnhancedMockData() {
  const now = new Date();
  return {
    user: {
      id: 'user-1',
      phone: '13800138000',
      name: '测试学员',
      role: 'student',
      points: 175,
      gender: 'male',
      birthday: null,
      avatar: null,
      classIds: ['class-1']
    },
    courses: [
      { _id: 'course-1', name: '口才基础班', description: '培养孩子良好的语言表达能力', level: '入门', courseStatus: 'ongoing' },
      { _id: 'course-2', name: '演讲进阶班', description: '提升演讲技巧', level: '进阶', courseStatus: 'ongoing' }
    ],
    classes: [
      { _id: 'class-1', name: '口才基础1班', courseId: { name: '口才基础班' }, studentCount: 15, classStatus: 'ongoing' }
    ],
    homeworks: [
      {
        _id: 'homework-1',
        title: '自我介绍练习',
        content: '录制一段1分钟的自我介绍视频',
        deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        points: 10,
        hasCheckin: false,
        isPublished: true,
        courseId: { name: '口才基础班' },
        classId: { name: '口才基础1班' },
        cycle: { type: 'single' },
        frequency: { timesPerCycle: 1 },
        totalTasksCount: 1,
        completedTimes: 0,
        completedCycles: 0,
        isCompleted: false
      },
      {
        _id: 'homework-2',
        title: '每日朗读打卡',
        content: '每天朗读一篇课文，录制音频提交',
        deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        points: 5,
        hasCheckin: true,
        checkinPoints: 5,
        sharePoints: 10,
        isPublished: true,
        courseId: { name: '口才基础班' },
        classId: { name: '口才基础1班' },
        cycle: { type: 'multi', durationDays: 1 },
        frequency: { timesPerCycle: 1 },
        totalTasksCount: 7,
        completedTimes: 3,
        completedCycles: 0,
        isCompleted: false
      },
      {
        _id: 'homework-3',
        title: '绕口令挑战',
        content: '练习绕口令并录制视频',
        deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        points: 8,
        hasCheckin: true,
        checkinPoints: 3,
        sharePoints: 5,
        isPublished: true,
        courseId: { name: '口才基础班' },
        classId: { name: '口才基础1班' },
        cycle: { type: 'multi', durationDays: 3 },
        frequency: { timesPerCycle: 1 },
        totalTasksCount: 3,
        completedTimes: 3,
        completedCycles: 3,
        isCompleted: true
      }
    ],
    checkinStats: {
      totalCheckins: 15,
      currentStreak: 5,
      maxStreak: 10,
      todayCheckins: 1
    }
  };
}

async function loadAllDataBatch() {
  if (AppState.dataCache && (Date.now() - AppState.cacheTime) < AppState.CACHE_DURATION) {
    console.log('📦 Using cached data');
    updateUI(AppState.dataCache);
    return;
  }

  showLoading(true);
  
  try {
    const result = await apiRequest('/batch/init');
    
    if (result.code === 200 && result.data) {
      AppState.dataCache = result.data;
      AppState.cacheTime = Date.now();
      updateUI(result.data);
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    showToast('加载数据失败，请重试', 'error');
  } finally {
    showLoading(false);
  }
}

function showLoading(show) {
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(el => {
    el.style.display = show ? 'block' : 'none';
  });
}

function updateUI(data) {
  if (data.user) {
    AppState.currentUser = data.user;
    document.getElementById('userName').textContent = data.user.name;
    document.getElementById('homePoints').textContent = data.user.points || 0;
    updateUserAvatar();
  }
  
  if (data.homeworks) {
    AppState.allHomeworks = data.homeworks;
  }
  
  if (data.courses) {
    AppState.allCourses = data.courses;
    renderCourseList();
    updateCourseFilter();
  }
  
  if (data.checkinStats) {
    document.getElementById('homeCheckinStreak').textContent = data.checkinStats.currentStreak || 0;
    document.getElementById('homeTodayCheckin').textContent = data.checkinStats.todayCheckins || 0;
    document.getElementById('totalCheckins').textContent = data.checkinStats.totalCheckins || 0;
    document.getElementById('currentStreak').textContent = data.checkinStats.currentStreak || 0;
    document.getElementById('maxStreak').textContent = data.checkinStats.maxStreak || 0;
    document.getElementById('todayCheckin').textContent = data.checkinStats.todayCheckins || 0;
  }
  
  renderHomeworkQuickList();
  renderHomeworkList();
}

function updateUserAvatar() {
  const avatarEl = document.getElementById('userAvatar');
  const avatarPreview = document.getElementById('avatarPreview');
  const avatarEmoji = document.getElementById('avatarEmoji');
  
  if (!avatarEl) return;
  
  const avatar = AppState.currentUser?.avatar;
  
  if (avatar && avatar.startsWith('data:')) {
    avatarEl.innerHTML = `<img src="${avatar}" style="width:100%;height:100%;object-fit:cover;">`;
    if (avatarPreview) avatarPreview.src = avatar;
    if (avatarEmoji) avatarEmoji.style.display = 'none';
  } else {
    const genderEmoji = AppState.currentUser?.gender === 'female' ? '👧' : '👦';
    avatarEl.innerHTML = `<span style="font-size:24px;">${genderEmoji}</span>`;
    if (avatarEmoji) avatarEmoji.style.display = 'inline';
  }
}

function renderCourseList() {
  const list = document.getElementById('courseList');
  if (!list) return;
  
  const courses = AppState.allCourses;
  
  if (!courses || courses.length === 0) {
    list.innerHTML = '<div class="empty"><div class="empty-text">暂无课程</div></div>';
    return;
  }
  
  list.innerHTML = courses.map(course => `
    <div class="card course-card" onclick="showCourseDetail('${escapeAttr(course._id)}')">
      <div class="card-body">
        <div class="course-header">
          <h3 class="course-title">${escapeHtml(course.name)}</h3>
          <span class="badge badge-${course.level === '入门' ? 'success' : 'primary'}">${escapeHtml(course.level)}</span>
        </div>
        <p class="course-desc">${escapeHtml(course.description || '')}</p>
        <div class="course-meta">
          <span class="meta-item">📚 ${course.courseStatus === 'ongoing' ? '进行中' : '已结束'}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function updateCourseFilter() {
  const select = document.getElementById('homeworkCourseFilter');
  if (!select) return;
  
  const courses = AppState.allCourses;
  select.innerHTML = '<option value="">全部课程</option>' + 
    courses.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
}

function showCourseDetail(courseId) {
  const course = AppState.allCourses.find(c => c._id === courseId);
  if (!course) return;
  
  document.getElementById('modalCourseTitle').textContent = course.name;
  document.getElementById('courseDetailContent').innerHTML = `
    <div class="detail-item">
      <label>课程名称</label>
      <div>${escapeHtml(course.name)}</div>
    </div>
    <div class="detail-item">
      <label>课程级别</label>
      <div>${escapeHtml(course.level || '未设置')}</div>
    </div>
    <div class="detail-item">
      <label>课程描述</label>
      <div>${escapeHtml(course.description || '暂无描述')}</div>
    </div>
    <div class="detail-item">
      <label>课程状态</label>
      <div>${course.courseStatus === 'ongoing' ? '进行中' : '已结束'}</div>
    </div>
  `;
  
  document.getElementById('courseDetailModal').classList.add('show');
}

function renderHomeworkQuickList() {
  const pending = AppState.allHomeworks.filter(h => !h.isCompleted).slice(0, 3);
  const list = document.getElementById('homeworkQuickList');
  
  if (!list) return;
  
  if (pending.length > 0) {
    list.innerHTML = pending.map(h => renderHomeworkItem(h, false)).join('');
  } else {
    list.innerHTML = '<div class="empty"><div class="empty-text">🎉 所有作业已完成！</div></div>';
  }
}

function renderHomeworkList() {
  const courseFilter = document.getElementById('homeworkCourseFilter')?.value || '';
  const statusFilter = document.getElementById('homeworkStatusFilter')?.value || '';
  
  let filtered = [...AppState.allHomeworks];
  
  if (courseFilter) {
    filtered = filtered.filter(h => h.courseId?._id === courseFilter || h.courseId === courseFilter);
  }
  
  if (statusFilter === 'pending') {
    filtered = filtered.filter(h => !h.isCompleted);
  } else if (statusFilter === 'completed') {
    filtered = filtered.filter(h => h.isCompleted);
  }
  
  const list = document.getElementById('homeworkList');
  if (!list) return;
  
  const pending = filtered.filter(h => !h.isCompleted);
  const completed = filtered.filter(h => h.isCompleted);
  
  let listHtml = '';
  
  if (pending.length > 0) {
    listHtml += `<div class="empty" style="background: #FFF7E6; font-weight: 600; color: #FA8C16; padding: 12px 16px; border-radius: 8px 8px 0 0;">📝 待完成 (${pending.length})</div>`;
    listHtml += pending.map(h => renderHomeworkItem(h, false)).join('');
  }
  
  if (completed.length > 0) {
    listHtml += `<div class="empty" style="background: #F6FFED; font-weight: 600; color: #52C41A; padding: 12px 16px; border-radius: 8px 8px 0 0;">✅ 已完成 (${completed.length})</div>`;
    listHtml += completed.map(h => renderHomeworkItem(h, true)).join('');
  }
  
  if (!listHtml) listHtml = '<div class="empty"><div class="empty-text">暂无作业</div></div>';
  
  list.innerHTML = listHtml;
  bindHomeworkButtonEvents();
}

function bindHomeworkButtonEvents() {
  if (AppState.isEventBound) return;
  AppState.isEventBound = true;
  
  const homeworkList = document.getElementById('homeworkList');
  if (!homeworkList) return;
  
  homeworkList.addEventListener('click', function(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    
    const action = el.dataset.action;
    const id = el.dataset.id || el.dataset.homework;
    
    if (!id) return;
    
    switch (action) {
      case 'cycle-toggle':
        toggleCycles(id);
        break;
      case 'complete':
      case 'pending':
        handleHomeworkAction(id);
        break;
      case 'share':
        openHomeworkShareModal(id);
        break;
      case 'submit':
      case 'view':
        const cycleIndex = parseInt(el.dataset.cycle) || 0;
        const timeIndex = parseInt(el.dataset.time) || 0;
        openUploadModal(id, cycleIndex, timeIndex);
        break;
      case 'checkin':
        handleCheckinAction(id);
        break;
      case 'checkin-share':
        openCheckinShareModal(id);
        break;
      case 'view-detail':
        toggleCycles(id);
        break;
    }
  });
  
  homeworkList.addEventListener('click', function(e) {
    const el = e.target.closest('.time-item');
    if (el) {
      const homeworkId = el.dataset.homework;
      const cycleIndex = parseInt(el.dataset.cycle);
      const timeIndex = parseInt(el.dataset.time);
      openUploadModal(homeworkId, cycleIndex, timeIndex);
    }
  });
}

function renderHomeworkItem(h, isCompleted) {
  const courseName = escapeHtml(h.courseId?.name || '未知课程');
  const className = escapeHtml(h.classId?.name || '未知班级');
  const publishTime = new Date(h.publishTime).toLocaleDateString();
  const deadline = new Date(h.deadline).toLocaleDateString();
  
  const { cycles } = calculateCycles(h);
  const isSingleHomework = h.cycle?.type !== 'multi';
  const hasCheckin = h.hasCheckin === true;
  const completedTimes = h.completedTimes || 0;
  const totalTasks = h.totalTasksCount || 1;
  
  let actionBtn = '';
  if (isCompleted) {
    actionBtn = `
      <button class="btn btn-sm btn-success" data-action="share" data-id="${escapeAttr(h._id)}">
        📤 分享
      </button>
    `;
  } else {
    if (hasCheckin) {
      actionBtn = `
        <button class="btn btn-sm btn-primary" data-action="checkin" data-id="${escapeAttr(h._id)}">
          📅 打卡
        </button>
      `;
    } else {
      actionBtn = `
        <button class="btn btn-sm btn-primary" data-action="complete" data-id="${escapeAttr(h._id)}">
          📝 ${isSingleHomework ? '做作业' : '去完成'}
        </button>
      `;
    }
  }

  return `
    <div class="card homework-card ${isCompleted ? 'completed' : ''}">
      <div class="card-body">
        <div class="homework-header">
          <h4 class="homework-title">${escapeHtml(h.title)}</h4>
          ${h.hasCheckin ? '<span class="badge badge-warning">📅 打卡</span>' : ''}
        </div>
        <div class="homework-meta">
          <span>📚 ${courseName}</span>
          <span>📅 ${escapeHtml(deadline)}</span>
        </div>
        <div class="homework-progress">
          <div class="progress-text">
            ${completedTimes}/${totalTasks} ${hasCheckin ? '次打卡' : '次作业'}
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${(completedTimes / totalTasks) * 100}%"></div>
          </div>
        </div>
        <div class="homework-actions">
          ${actionBtn}
          ${!isCompleted && !isSingleHomework ? `
            <button class="btn btn-sm btn-secondary" data-action="view-detail" data-id="${escapeAttr(h._id)}">
              📋 查看详情
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

function calculateCycles(homework) {
  const now = new Date();
  const deadline = new Date(homework.deadline);
  const publishTime = new Date(homework.publishTime || now);
  
  if (homework.cycle?.type !== 'multi') {
    return { totalDays: 1, cycles: 1, cycleDays: 1 };
  }
  
  const durationDays = homework.cycle?.durationDays || 1;
  const totalDays = Math.max(1, Math.ceil((deadline - publishTime) / (1000 * 60 * 60 * 24)) + 1);
  const cycles = Math.max(1, Math.ceil(totalDays / durationDays));
  
  return { totalDays, cycles, cycleDays: durationDays };
}

function locateAndHighlightIncomplete(homeworkId) {
  const h = AppState.allHomeworks.find(item => item._id === homeworkId);
  if (!h) return;
  
  const { cycles } = calculateCycles(h);
  const timesPerCycle = h.frequency?.timesPerCycle || 1;
  
  for (let c = 0; c < cycles; c++) {
    for (let t = 0; t < timesPerCycle; t++) {
      const key = `${homeworkId}-${c}-${t}`;
      const el = document.getElementById(`timeItem-${key}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight');
        setTimeout(() => el.classList.remove('highlight'), 2000);
        return;
      }
    }
  }
}

function handleCheckinAction(homeworkId) {
  openCheckinShareModal(homeworkId);
}

function openCheckinShareModal(homeworkId) {
  const h = AppState.allHomeworks.find(item => item._id === homeworkId);
  if (!h) return;
  
  const completedTimes = h.completedTimes || 0;
  const totalTasks = h.totalTasksCount || 1;
  const canCheckin = completedTimes < totalTasks;
  
  let content = `
    <div class="checkin-modal-content">
      <h4>${escapeHtml(h.title)}</h4>
      <p>打卡进度: ${completedTimes}/${totalTasks}</p>
      ${canCheckin ? `
        <button class="btn btn-primary btn-block" onclick="doCheckin('${escapeAttr(homeworkId)}')">
          📅 立即打卡
        </button>
      ` : `
        <div class="alert alert-success">🎉 打卡任务全部完成！</div>
      `}
      <button class="btn btn-secondary btn-block" onclick="shareToWechat('${escapeAttr(homeworkId)}', 'moments')">
        📤 分享到朋友圈
      </button>
    </div>
  `;
  
  document.getElementById('shareContent').innerHTML = content;
  document.getElementById('shareModal').classList.add('show');
}

async function doCheckin(homeworkId) {
  showToast('正在打卡...', 'info');
  
  try {
    const result = await apiRequest('/checkin/submit', {
      method: 'POST',
      body: JSON.stringify({
        homeworkId,
        cycleIndex: 0,
        timeIndex: 0
      })
    });
    
    if (result.success || result.code === 200) {
      showToast(`打卡成功！获得${result.data?.pointsEarned || 5}积分`, 'success');
      AppState.currentUser.points = (AppState.currentUser.points || 0) + (result.data?.pointsEarned || 5);
      document.getElementById('homePoints').textContent = AppState.currentUser.points;
      closeModal('shareModal');
      loadAllDataBatch();
    } else {
      showToast(result.message || '打卡失败', 'error');
    }
  } catch (error) {
    showToast('打卡失败，请重试', 'error');
  }
}

async function shareToWechat(homeworkId, shareType) {
  try {
    const result = await apiRequest('/homework/share', {
      method: 'POST',
      body: JSON.stringify({ homeworkId, shareType })
    });
    
    if (result.success || result.code === 200) {
      showToast('分享成功！', 'success');
      if (result.data?.earnedPoints) {
        AppState.currentUser.points = (AppState.currentUser.points || 0) + result.data.earnedPoints;
        showToast(`获得${result.data.earnedPoints}分享积分`, 'success');
      }
    } else {
      showToast(result.message || '分享失败', 'error');
    }
  } catch (error) {
    showToast('分享失败，请重试', 'error');
  }
}

function openUploadModal(homeworkId, cycleIndex, timeIndex) {
  const h = AppState.allHomeworks.find(item => item._id === homeworkId);
  if (!h) return;
  
  AppState.currentHomework = h;
  AppState.currentUploadHomework = { homeworkId, cycleIndex, timeIndex };
  AppState.uploadedFiles = [];
  
  const modal = document.getElementById('homeworkDetailModal');
  if (!modal) return;
  
  document.getElementById('modalHomeworkTitle').textContent = h.title;
  document.getElementById('homeworkDetailContent').innerHTML = `
    <div class="upload-section">
      <h4>作业内容</h4>
      <p>${escapeHtml(h.content || '请按照要求完成作业')}</p>
      
      <div class="upload-area" id="uploadArea" onclick="document.getElementById('fileInput').click()">
        <div class="upload-icon">📁</div>
        <div class="upload-text">点击上传文件</div>
        <div class="upload-hint">支持图片、音频、视频 (最大10MB)</div>
        <input type="file" id="fileInput" multiple accept="image/*,audio/*,video/*" style="display:none" onchange="handleFileSelect(event)">
      </div>
      
      <div id="uploadPreview" class="upload-preview"></div>
      
      <div class="form-group">
        <label>备注（可选）</label>
        <textarea id="homeworkComment" placeholder="添加备注..." style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;min-height:60px;"></textarea>
      </div>
      
      <button class="btn btn-primary btn-block" onclick="submitHomework()">提交作业</button>
    </div>
  `;
  
  modal.classList.add('show');
}

function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  const maxSize = 10 * 1024 * 1024;
  
  files.forEach(file => {
    if (file.size > maxSize) {
      showToast(`文件 ${file.name} 超过10MB限制`, 'error');
      return;
    }
    AppState.uploadedFiles.push(file);
  });
  
  renderUploadPreview();
}

function renderUploadPreview() {
  const container = document.getElementById('uploadPreview');
  if (!container) return;
  
  if (AppState.uploadedFiles.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = AppState.uploadedFiles.map((file, index) => `
    <div class="preview-item">
      <span class="preview-icon">${getFileIcon(file.type)}</span>
      <span class="preview-name">${file.name}</span>
      <span class="preview-size">${(file.size / 1024).toFixed(1)}KB</span>
      <button class="preview-remove" onclick="removeFile(${index})">&times;</button>
    </div>
  `).join('');
}

function getFileIcon(mimeType) {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.startsWith('video/')) return '🎬';
  return '📄';
}

function removeFile(index) {
  AppState.uploadedFiles.splice(index, 1);
  renderUploadPreview();
}

async function submitHomework() {
  if (AppState.uploadedFiles.length === 0) {
    showToast('请先上传文件', 'error');
    return;
  }
  
  const { homeworkId, cycleIndex, timeIndex } = AppState.currentUploadHomework;
  const comment = document.getElementById('homeworkComment')?.value || '';
  
  showToast('正在提交...', 'info');
  
  try {
    const files = AppState.uploadedFiles.map(file => ({
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('audio/') ? 'audio' : 'video',
      url: 'mock-url',
      filename: file.name,
      size: file.size
    }));
    
    const result = await apiRequest('/homework/submit', {
      method: 'POST',
      body: JSON.stringify({ homeworkId, cycleIndex, timeIndex, files, comment })
    });
    
    if (result.success || result.code === 200) {
      showToast('作业提交成功！', 'success');
      if (result.data?.earnedPoints) {
        AppState.currentUser.points = (AppState.currentUser.points || 0) + result.data.earnedPoints;
        showToast(`获得${result.data.earnedPoints}积分`, 'success');
      }
      closeModal('homeworkDetailModal');
      loadAllDataBatch();
    } else {
      showToast(result.message || '提交失败', 'error');
    }
  } catch (error) {
    showToast('提交失败，请重试', 'error');
  }
}

async function loadRanking() {
  try {
    const result = await apiRequest('/points/ranking', 'GET', { period: 'week' });
    
    if (result.code === 200 && result.data?.ranking) {
      const container = document.getElementById('rankingContainer');
      const list = document.getElementById('rankingListOld');
      
      if (container) container.style.display = 'block';
      
      if (list) {
        list.innerHTML = result.data.ranking.map(item => `
          <li class="ranking-item ${item.isCurrentUser ? 'current' : ''}">
            <span class="rank">${item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : item.rank}</span>
            <span class="name">${item.name}</span>
            <span class="points">${item.totalPoints}积分</span>
          </li>
        `).join('');
      }
    }
  } catch (error) {
    showToast('加载排行榜失败', 'error');
  }
}

async function loadPointsRecords() {
  try {
    const container = document.getElementById('pointsRecordsContainer');
    const list = document.getElementById('pointsRecordsList');
    
    if (container) container.style.display = 'block';
    
    const startDate = document.getElementById('pointsStartDate')?.value;
    const endDate = document.getElementById('pointsEndDate')?.value;
    const result = await apiRequest('/points/records', 'GET', { startDate, endDate });
    
    if (result.data && list) {
      list.innerHTML = result.data.map(record => `
        <li class="record-item">
          <span class="record-type ${record.type}">${record.type === 'earn' ? '+' : '-'}${record.amount}</span>
          <span class="record-desc">${escapeHtml(record.description || record.source)}</span>
          <span class="record-date">${new Date(record.createdAt).toLocaleDateString()}</span>
        </li>
      `).join('');
    }
  } catch (error) {
    showToast('加载记录失败', 'error');
  }
}

function filterPointsRecords() {
  const startDate = document.getElementById('pointsStartDate')?.value;
  const endDate = document.getElementById('pointsEndDate')?.value;
  loadPointsRecords(startDate, endDate);
}

function resetPointsFilter() {
  document.getElementById('pointsStartDate').value = '';
  document.getElementById('pointsEndDate').value = '';
  loadPointsRecords();
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const panel = document.getElementById(tabName);
  const btn = document.querySelector(`[data-tab="${tabName}"]`);
  
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');
}

function openProfileModal() {
  if (!AppState.currentUser) {
    showToast('请先登录', 'error');
    return;
  }
  
  const modal = document.getElementById('profileModal');
  if (!modal) return;
  
  document.getElementById('phoneInput').value = AppState.currentUser.phone || '';
  document.getElementById('nameInput').value = AppState.currentUser.name || '';
  document.getElementById('genderInput').value = AppState.currentUser.gender || 'other';
  document.getElementById('birthdayInput').value = AppState.currentUser.birthday || '';
  
  modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

function closeShareSuccessModal() {
  closeModal('shareSuccessModal');
}

function closePreviewModal() {
  closeModal('previewModal');
}

let tempAvatar = null;

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (!file.type.startsWith('image/')) {
    showToast('请选择图片文件', 'error');
    return;
  }
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    tempAvatar = e.target.result;
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarEmoji = document.getElementById('avatarEmoji');
    
    if (avatarPreview) {
      avatarPreview.src = tempAvatar;
      avatarPreview.style.display = 'block';
    }
    if (avatarEmoji) avatarEmoji.style.display = 'none';
  };
  
  reader.readAsDataURL(file);
}

async function saveProfile() {
  const avatar = tempAvatar;
  const name = document.getElementById('nameInput').value.trim();
  const gender = document.getElementById('genderInput').value;
  const birthday = document.getElementById('birthdayInput').value || null;
  
  if (!name) {
    showToast('请输入姓名', 'error');
    return;
  }
  
  AppState.currentUser = { ...AppState.currentUser, name, gender, birthday, avatar };
  document.getElementById('userName').textContent = name;
  updateUserAvatar();
  
  showToast('保存成功', 'success');
  closeModal('profileModal');
}

function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  AppState.token = null;
  AppState.currentUser = null;
  AppState.dataCache = null;
  
  document.getElementById('loginSection').style.display = 'flex';
  document.getElementById('mainSection').style.display = 'none';
  
  showToast('已退出登录', 'info');
}

async function quickLogin(phone, name) {
  showStatus('正在登录...', 'info');
  
  try {
    const result = await apiRequest('/auth/test-login', {
      method: 'POST',
      body: JSON.stringify({ phone, name })
    });
    
    if (result.code === 200 && result.data) {
      AppState.token = result.data.token;
      AppState.currentUser = result.data.user;
      
      // ⚠️ 生产环境建议使用 HttpOnly Cookie 存储 Token 以提高安全性
      // 当前存储方式适用于不需要高安全性的内部系统
      try {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
      } catch (e) {
        console.warn('localStorage 不可用，使用内存存储');
      }
      
      document.getElementById('loginSection').style.display = 'none';
      document.getElementById('mainSection').style.display = 'block';
      document.getElementById('userName').textContent = result.data.user.name;
      
      showStatus('登录成功！', 'success');
      
      loadAllDataBatch();
    } else {
      showStatus(result.message || '登录失败', 'error');
    }
  } catch (error) {
    showStatus('登录失败，请重试', 'error');
  }
}

function openBirthdayPicker() {
  const birthdayInput = document.getElementById('birthdayInput');
  if (birthdayInput) {
    birthdayInput.style.display = 'block';
    birthdayInput.focus();
  }
}

function locateCurrentCheckin(homeworkId) {
  locateAndHighlightIncomplete(homeworkId);
}

function locateMakeupCheckin(homeworkId) {
  locateAndHighlightIncomplete(homeworkId);
}

function toggleTimesList(homeworkId, cycleIndex) {
  const list = document.getElementById(`timesList-${homeworkId}-${cycleIndex}`);
  if (list) {
    const isHidden = list.style.display === 'none';
    list.style.display = isHidden ? 'block' : 'none';
  }
}

function handleMakeupCheckin(homeworkId) {
  openCheckinShareModal(homeworkId);
}

function resetHomeworkFilters() {
  document.getElementById('homeworkCourseFilter').value = '';
  document.getElementById('homeworkStatusFilter').value = '';
  document.getElementById('homeworkDateFilter').value = '';
  renderHomeworkList();
}

function switchRankingPeriod(period) {
  document.querySelectorAll('[id^="rankingTab"]').forEach(btn => {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn');
  });
  document.getElementById('rankingTab' + period.charAt(0).toUpperCase() + period.slice(1))?.classList.add('btn-primary');
  loadRanking();
}

function switchRankingScope(scope) {
  document.querySelectorAll('.ranking-scope-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('rankingScope' + scope.charAt(0).toUpperCase() + scope.slice(1))?.classList.add('active');
  loadRanking();
}

async function init() {
  console.log('🚀 init() called');
  
  try {
    await loadModules();
  } catch (e) {
    console.warn('⚠️ Module loading failed:', e);
  }
  
  const refreshPointsBtn = document.getElementById('refreshPoints');
  const showRankingBtn = document.getElementById('showRanking');
  const showRecordsBtn = document.getElementById('showPointsRecords');
  
  if (refreshPointsBtn) {
    refreshPointsBtn.addEventListener('click', debounce(() => {
      AppState.dataCache = null;
      loadAllDataBatch();
    }, 500));
  }
  
  if (showRankingBtn) {
    showRankingBtn.addEventListener('click', () => loadRanking());
  }
  
  if (showRecordsBtn) {
    showRecordsBtn.addEventListener('click', () => loadPointsRecords());
  }
  
  const savedToken = localStorage.getItem('token');
  console.log('🔑 Saved token:', savedToken ? 'exists' : 'not found');
  
  if (savedToken) {
    AppState.token = savedToken;
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      AppState.currentUser = JSON.parse(savedUser);
    } else {
      AppState.currentUser = { name: '测试用户', phone: '13800138000', role: 'student', points: 100 };
    }
    
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
    document.getElementById('userName').textContent = AppState.currentUser.name;
    updateUserAvatar();
    
    loadAllDataBatch();
  } else {
    console.log('🔒 No token found, showing login');
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('mainSection').style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', init);
