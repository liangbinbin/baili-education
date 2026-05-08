const API_BASE = '/api';
const TEST_MODE = true;

let coursesCache = [];
let classesCache = [];

const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const toast = {
    show: function(text, type = 'info') {
        const toastEl = document.createElement('div');
        toastEl.className = 'toast';
        toastEl.style.cssText = 'position:fixed;top:20px;right:20px;padding:12px 20px;background:#fff;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.1);z-index:9999;animation:slideIn 0.3s ease;';
        if (type === 'error') toastEl.style.borderLeft = '4px solid #f56c6c';
        if (type === 'success') toastEl.style.borderLeft = '4px solid #67c23a';
        toastEl.textContent = text;
        document.body.appendChild(toastEl);
        setTimeout(() => toastEl.remove(), 3000);
    }
};
const showToast = toast.show.bind(toast);

async function api(method, path, body) {
    const url = API_BASE + path;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'x-test-role': 'teacher',
            'x-test-user-id': 'teacher_1'
        }
    };
    if (body) options.body = JSON.stringify(body);
    const res = await fetch(url, options);
    return await res.json();
}

function showModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('show');
}

function hideModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
}

function formatStatus(status) {
    const map = { enrolling: '报名中', ongoing: '进行中', ended: '已结课', active: '正常', paused: '停课' };
    return map[status] || status;
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

async function loadCourses() {
    const res = await api('GET', '/course');
    if (res.code === 200) {
        coursesCache = res.data || [];
        renderCourses();
        updateCourseFilters();
    }
}

function renderCourses() {
    const container = document.getElementById('courseList');
    if (!container) return;
    
    const gradeMap = {
        'grade1': '一年级', 'grade2': '二年级', 'grade3': '三年级',
        'grade4': '四年级', 'grade5': '五年级', 'grade6': '六年级'
    };
    
    const typeMap = {
        'main': { text: '主体系列课程', class: 'course-card-tag-main' },
        'elective': { text: '辅助选修课程', class: 'course-card-tag-elective' },
        'other': { text: '其他课程', class: 'course-card-tag-other' }
    };
    
    const statusMap = {
        'enrolling': { text: '正在报名', class: 'course-card-status-enrolling' },
        'ongoing': { text: '进行中', class: 'course-card-status-enrolling' },
        'paused': { text: '暂停报名', class: 'course-card-status-paused' },
        'ended': { text: '停止报名', class: 'course-card-status-ended' }
    };
    
    container.innerHTML = coursesCache.map(c => {
        const type = typeMap[c.courseType] || typeMap['other'];
        const status = statusMap[c.courseStatus] || statusMap['enrolling'];
        const suitableGrade = (c.suitableGrade || []).map(g => gradeMap[g] || g).join('、') || '--';
        const relatedClasses = classesCache.filter(cls => {
            const clsCourseId = cls.courseId?._id || cls.courseId;
            return clsCourseId === c._id;
        });
        
        return `
        <div class="course-card">
            <div class="course-card-header">
                <h3 class="course-card-title">${c.name}</h3>
                <div class="course-card-tags">
                    <span class="course-card-tag ${type.class}">${c.courseTypeText || type.text}</span>
                    <span class="course-card-tag ${status.class}">${status.text}</span>
                </div>
            </div>
            
            <div class="course-card-info">
                <div class="course-info-row">
                    <span class="course-info-label">📚 适合年级</span>
                    <span class="course-info-value">${suitableGrade}</span>
                </div>
                <div class="course-info-row">
                    <span class="course-info-label">📖 课节数量</span>
                    <span class="course-info-value">${c.sections?.length || 0} 节</span>
                </div>
                <div class="course-info-row">
                    <span class="course-info-label">👥 关联班级</span>
                    <span class="course-info-value">${relatedClasses.length} 个班级</span>
                </div>
                <div class="course-info-row">
                    <span class="course-info-label">⭐ 课程级别</span>
                    <span class="course-info-value">${c.level || '--'}</span>
                </div>
            </div>
            
            <div class="course-card-intro">${c.courseIntro || c.description || '暂无简介'}</div>
            
            <button class="course-card-btn" onclick="event.stopPropagation(); showCourseDetail('${c._id}')">
                查看课程详情
            </button>
        </div>
        `;
    }).join('');
}

function updateCourseFilters() {
    const select = document.getElementById('classCourseFilter');
    if (!select) return;
    const current = select.value;
    select.innerHTML = '<option value="">全部课程</option>' + 
        coursesCache.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
    select.value = current;
}

async function showCourseDetail(courseId) {
    const res = await api('GET', `/course/${courseId}`);
    if (res.code !== 200) { showToast('获取课程详情失败', 'error'); return; }
    const c = res.data;
    document.getElementById('courseDetailTitle').textContent = '课程详情';
    
    const gradeMap = {
        'grade1': '一年级', 'grade2': '二年级', 'grade3': '三年级',
        'grade4': '四年级', 'grade5': '五年级', 'grade6': '六年级'
    };
    const suitableGradeText = (c.suitableGrade || []).map(g => gradeMap[g] || g).join('、') || '--';
    
    // 报名状态映射
    const statusMap = {
        'enrolling': { text: '正在报名', class: 'tag-status-enrolling' },
        'ongoing': { text: '进行中', class: 'tag-status-enrolling' },
        'ended': { text: '停止报名', class: 'tag-status-ended' },
        'paused': { text: '暂停报名', class: 'tag-status-paused' }
    };
    const status = statusMap[c.courseStatus] || statusMap['enrolling'];
    
    // 课程类型映射
    const typeMap = {
        'main': { text: '主体系列课程', class: 'tag-type-main' },
        'elective': { text: '辅助选修课程', class: 'tag-type-elective' },
        'other': { text: '其他课程', class: 'tag-type-other' }
    };
    const type = typeMap[c.courseType] || typeMap['other'];
    
    // 获取关联班级信息
    const relatedClasses = classesCache.filter(cls => {
        const clsCourseId = cls.courseId?._id || cls.courseId;
        return clsCourseId === courseId;
    });
    
    // Banner轮播图（使用emoji作为示例，实际可以是图片URL数组）
    const bannerImages = c.bannerImages || ['📚', '🎓', '✨'];
    
    document.getElementById('courseDetailBody').innerHTML = `
        <!-- Banner轮播图 -->
        <div class="course-banner">
            <div class="course-banner-slider" id="courseBannerSlider">
                ${bannerImages.map((img, idx) => `
                    <div class="course-banner-slide" style="background: ${idx % 2 === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}">
                        ${img}
                    </div>
                `).join('')}
            </div>
            <div class="course-banner-dots">
                ${bannerImages.map((_, idx) => `
                    <div class="banner-dot ${idx === 0 ? 'active' : ''}" onclick="switchBannerSlide(${idx})"></div>
                `).join('')}
            </div>
        </div>
        
        <!-- 课程名称 -->
        <div class="course-title">${c.name}</div>
        
        <!-- 课程类型和报名状态 -->
        <div class="course-tags">
            <span class="course-tag ${type.class}">🏷️ ${c.courseTypeText || type.text}</span>
            <span class="course-tag ${status.class}">📋 ${status.text}</span>
        </div>
        
        <!-- 基本信息网格 -->
        <div class="course-info-grid">
            <div class="course-info-item">
                <span class="course-info-label">适合年级</span>
                <span class="course-info-value">${suitableGradeText}</span>
            </div>
            <div class="course-info-item">
                <span class="course-info-label">创建时间</span>
                <span class="course-info-value">${formatDate(c.createdAt)}</span>
            </div>
            <div class="course-info-item">
                <span class="course-info-label">课程级别</span>
                <span class="course-info-value">${c.level || '--'}</span>
            </div>
            <div class="course-info-item">
                <span class="course-info-label">课节数量</span>
                <span class="course-info-value">${c.sections?.length || 0} 节</span>
            </div>
        </div>
        
        <!-- 课节列表（可展开） -->
        <div class="course-section collapsible">
            <div class="course-section-header" onclick="toggleCourseSection('sections')">
                <div class="course-section-title">
                    📖 课节列表
                    <span class="course-section-count">(${c.sections?.length || 0}个课节)</span>
                </div>
                <span class="course-section-arrow" id="sectionsArrow">▼</span>
            </div>
            <div class="course-section-content" id="sectionsContent">
                <div class="section-list">
                    ${c.sections?.length > 0 ? c.sections.map(s => `
                        <div class="section-item">
                            <span class="section-num">${s.sectionNum}</span>
                            <span class="section-name">${s.name}</span>
                            <span class="section-duration">${s.duration || 90}分钟</span>
                        </div>
                    `).join('') : '<div style="padding: 16px; text-align: center; color: #999;">暂无课节信息</div>'}
                </div>
            </div>
        </div>
        
        <!-- 关联班级（教师端特有，可展开） -->
        <div class="course-section collapsible">
            <div class="course-section-header" onclick="toggleCourseSection('classes')">
                <div class="course-section-title">
                    👥 关联班级
                    <span class="course-section-count">(${relatedClasses.length}个班级)</span>
                </div>
                <span class="course-section-arrow" id="classesArrow">▼</span>
            </div>
            <div class="course-section-content" id="classesContent">
                <div class="section-list">
                    ${relatedClasses.length > 0 ? relatedClasses.map(cls => `
                        <div class="class-list-item">
                            <div class="class-info">
                                <div class="class-name">${cls.name}</div>
                                <div class="class-meta">
                                    ${cls.classStatus === 'ongoing' ? '🔵 正常' : cls.classStatus === 'paused' ? '🟡 停课' : '⚪ 结班'} · 
                                    ${cls.studentCount || cls.studentIds?.length || 0}人 · 
                                    ${cls.classroom || '未分配教室'}
                                </div>
                            </div>
                            <span class="card-badge badge-${cls.classStatus}">${formatStatus(cls.classStatus)}</span>
                        </div>
                    `).join('') : '<div style="padding: 16px; text-align: center; color: #999;">暂无关联班级</div>'}
                </div>
            </div>
        </div>
        
        <!-- 课程简介 -->
        <div class="course-section static">
            <div class="static-section-title">📝 课程简介</div>
            <div class="course-intro">${c.courseIntro || c.description || '暂无简介'}</div>
        </div>
        
        <!-- 课程详细内容 -->
        ${c.courseDetail ? `
        <div class="course-section static">
            <div class="static-section-title">📄 课程详情</div>
            <div class="course-detail-content">${c.courseDetail}</div>
        </div>
        ` : ''}
    `;
    
    // 初始化轮播
    initCourseBanner();
    
    showModal('courseDetailModal');
}

// Banner轮播相关变量和函数
let currentBannerSlide = 0;
let bannerInterval = null;

function initCourseBanner() {
    currentBannerSlide = 0;
    cleanupBannerInterval();
    const slider = document.getElementById('courseBannerSlider');
    if (slider) slider.style.transform = 'translateX(0)';
    const dots = document.querySelectorAll('.banner-dot');
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === 0));
    
    bannerInterval = setInterval(() => {
        const sliderEl = document.getElementById('courseBannerSlider');
        const dotEls = document.querySelectorAll('.banner-dot');
        if (sliderEl && dotEls.length > 0) {
            currentBannerSlide = (currentBannerSlide + 1) % dotEls.length;
            sliderEl.style.transform = `translateX(-${currentBannerSlide * 100}%)`;
            dotEls.forEach((dot, idx) => dot.classList.toggle('active', idx === currentBannerSlide));
        }
    }, 3000);
}

function cleanupBannerInterval() {
    if (bannerInterval) {
        clearInterval(bannerInterval);
        bannerInterval = null;
    }
}

function switchBannerSlide(index) {
    currentBannerSlide = index;
    const slider = document.getElementById('courseBannerSlider');
    const dots = document.querySelectorAll('.banner-dot');
    if (slider) {
        slider.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
    }
    cleanupBannerInterval();
    initCourseBanner();
}

function toggleCourseSection(sectionId) {
    const content = document.getElementById(sectionId + 'Content');
    const arrow = document.getElementById(sectionId + 'Arrow');
    if (content && arrow) {
        content.classList.toggle('expanded');
        arrow.classList.toggle('expanded');
    }
}

function hideModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('show');
        if (id === 'courseDetailModal' || id === 'classDetailModal' || id === 'homeworkDetailModal') {
            cleanupBannerInterval();
        }
    }
}

async function loadClasses() {
    const courseFilter = document.getElementById('classCourseFilter')?.value || '';
    const statusFilter = document.getElementById('classStatusFilter')?.value || '';
    const res = await api('GET', '/class');
    if (res.code === 200) {
        classesCache = res.data || [];
        let filtered = classesCache;
        if (courseFilter) {
            filtered = filtered.filter(c => c.courseId?._id === courseFilter || c.courseId === courseFilter);
        }
        if (statusFilter) {
            filtered = filtered.filter(c => c.classStatus === statusFilter);
        }
        renderClasses(filtered);
    }
}

function renderClasses(list) {
    const container = document.getElementById('classList');
    if (!container) return;
    
    const statusMap = {
        'active': { text: '正常', class: 'class-card-status-active' },
        'ongoing': { text: '正常', class: 'class-card-status-active' },
        'paused': { text: '停课', class: 'class-card-status-paused' },
        'ended': { text: '结班', class: 'class-card-status-ended' }
    };
    
    const scheduleTypeMap = {
        'schedule': '课程课节排课',
        'cycle': '周期性排课'
    };
    
    container.innerHTML = list.map(c => {
        const teacherNames = (c.teacherIds || []).map(t => t.name || t).join('、');
        const headTeacherName = c.headTeacherId?.name || c.headTeacherId || '';
        const status = statusMap[c.classStatus] || statusMap['ongoing'];
        const scheduleType = scheduleTypeMap[c.scheduleType] || '周期性排课';
        
        return `
        <div class="class-card" onclick="showClassDetail('${c._id}')">
            <div class="class-card-header">
                <div class="class-card-title-row">
                    <h3 class="class-card-title">${c.name}</h3>
                    <span class="class-card-status ${status.class}">${status.text}</span>
                </div>
                <div class="class-card-badges">
                    <span class="class-card-badge-schedule">📅 ${scheduleType}</span>
                </div>
            </div>
            
            <div class="class-card-info">
                <div class="class-info-item">
                    <span class="class-info-icon">👨‍🏫</span>
                    <div class="class-info-content">
                        <span class="class-info-label">任课教师</span>
                        <span class="class-info-value">${teacherNames || '--'}</span>
                    </div>
                </div>
                <div class="class-info-item">
                    <span class="class-info-icon">👩‍💼</span>
                    <div class="class-info-content">
                        <span class="class-info-label">班主任</span>
                        <span class="class-info-value">${headTeacherName || '--'}</span>
                    </div>
                </div>
                <div class="class-info-item">
                    <span class="class-info-icon">🏫</span>
                    <div class="class-info-content">
                        <span class="class-info-label">上课教室</span>
                        <span class="class-info-value">${c.classroom || '未分配'}</span>
                    </div>
                </div>
                <div class="class-info-item">
                    <span class="class-info-icon">👥</span>
                    <div class="class-info-content">
                        <span class="class-info-label">学员人数</span>
                        <span class="class-info-value">${c.studentCount || 0}人</span>
                    </div>
                </div>
            </div>
            
            <button class="class-card-btn" onclick="event.stopPropagation(); showClassDetail('${c._id}')">
                📋 查看班级详情
            </button>
        </div>
        `;
    }).join('');
}

async function showClassDetail(classId) {
    const res = await api('GET', `/class/${classId}`);
    if (res.code !== 200) { showToast('获取班级详情失败', 'error'); return; }
    const c = res.data;
    document.getElementById('classDetailTitle').textContent = '班级详情';
    
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    const teacherNames = (c.teacherIds || []).map(t => t.name || t).join('、');
    const headTeacherName = c.headTeacherId?.name || c.headTeacherId || '';
    const studentNames = (c.studentIds || []).map(s => s.name || s).join('、') || '暂无学生';
    const startDate = c.startDate ? formatDate(c.startDate) : '--';
    const endDate = c.endDate ? formatDate(c.endDate) : '--';
    
    const statusMap = {
        'active': { text: '正常', class: 'badge-success', bgColor: 'rgba(82, 196, 26, 0.1)', color: '#52c41a' },
        'ongoing': { text: '正常', class: 'badge-success', bgColor: 'rgba(82, 196, 26, 0.1)', color: '#52c41a' },
        'paused': { text: '停课', class: 'badge-warning', bgColor: 'rgba(250, 173, 20, 0.1)', color: '#faad14' },
        'ended': { text: '结班', class: 'badge-default', bgColor: 'rgba(153, 153, 153, 0.1)', color: '#999' }
    };
    const status = statusMap[c.classStatus] || statusMap['ongoing'];
    
    const scheduleTypeText = c.scheduleType === 'schedule' ? '课程课节排课' : '周期性排课';
    
    let scheduleHtml = '';
    if (c.scheduleType === 'schedule' && c.classSchedule?.length > 0) {
        const completedCount = c.classSchedule.filter(s => s.status === 'completed').length;
        scheduleHtml = `
            <div class="class-detail-section">
                <div class="class-detail-section-header" onclick="toggleClassSection('schedule')">
                    <div class="class-detail-section-title">
                        <span class="section-icon">📅</span>
                        上课时间
                        <span class="section-count">(${c.classSchedule.length}个课节)</span>
                    </div>
                    <span class="section-arrow" id="scheduleArrow">▼</span>
                </div>
                <div class="class-detail-section-content" id="scheduleContent">
                    <div class="schedule-list">
                        ${c.classSchedule.map((s, idx) => {
                            const sectionStatus = {
                                scheduled: { text: '待上课', class: 'status-pending', bgColor: '#f0f5ff', color: '#1890ff' },
                                completed: { text: '已完成', class: 'status-completed', bgColor: '#f6ffed', color: '#52c41a' },
                                cancelled: { text: '已取消', class: 'status-cancelled', bgColor: '#fff7e6', color: '#faad14' }
                            };
                            const sStatus = sectionStatus[s.status] || sectionStatus['scheduled'];
                            return `
                            <div class="schedule-item" style="border-left: 3px solid ${sStatus.color}; background: ${sStatus.bgColor};">
                                <div class="schedule-item-left">
                                    <div class="schedule-item-num">第${s.sectionNum}课</div>
                                    <div class="schedule-item-name">${s.sectionName}</div>
                                </div>
                                <div class="schedule-item-right">
                                    <div class="schedule-item-time">📅 ${formatDate(s.date)}</div>
                                    <div class="schedule-item-time">⏰ ${s.startTime} - ${s.endTime}</div>
                                    <div class="schedule-item-info">🏫 ${s.classroom || '待定'} · 👨‍🏫 ${s.teacherId?.name || s.teacherId || '待定'}</div>
                                    <span class="schedule-status-badge" style="background: ${sStatus.color}; color: white;">${sStatus.text}</span>
                                </div>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    } else {
        const scheduleText = (c.schedule || []).map(s => `${weekDays[s.dayOfWeek]} ${s.startTime}-${s.endTime}`).join('、');
        scheduleHtml = `
            <div class="class-detail-section">
                <div class="class-detail-section-title" style="cursor: default;">
                    <span class="section-icon">📅</span>
                    上课时间
                </div>
                <div class="schedule-simple">
                    ${scheduleText ? scheduleText.split('、').map(time => `
                        <div class="schedule-simple-item">
                            <span class="schedule-simple-dot"></span>
                            <span class="schedule-simple-text">${time}</span>
                        </div>
                    `).join('') : '<div style="color: #999; font-size: 14px;">暂无时间安排</div>'}
                </div>
            </div>
        `;
    }
    
    document.getElementById('classDetailBody').innerHTML = `
        <!-- 班级名称标题 -->
        <div class="class-detail-header">
            <div class="class-detail-cover" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">👥</div>
            <div class="class-detail-info">
                <div class="class-detail-title">${c.name}</div>
                <div class="class-detail-badges">
                    <span class="card-badge ${status.class}" style="background: ${status.bgColor}; color: ${status.color}; border: none;">${status.text}</span>
                    <span class="card-badge badge-info">${scheduleTypeText}</span>
                </div>
            </div>
        </div>
        
        <!-- 基本信息卡片 -->
        <div class="class-detail-cards">
            <div class="info-card">
                <div class="info-card-icon">🏫</div>
                <div class="info-card-content">
                    <div class="info-card-label">上课教室</div>
                    <div class="info-card-value">${c.classroom || '未分配'}</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-icon">👨‍🏫</div>
                <div class="info-card-content">
                    <div class="info-card-label">班主任</div>
                    <div class="info-card-value">${headTeacherName || '--'}</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-icon">👤</div>
                <div class="info-card-content">
                    <div class="info-card-label">任课教师</div>
                    <div class="info-card-value">${teacherNames || '--'}</div>
                </div>
            </div>
            <div class="info-card">
                <div class="info-card-icon">👥</div>
                <div class="info-card-content">
                    <div class="info-card-label">学员人数</div>
                    <div class="info-card-value">${c.studentCount || 0}人</div>
                </div>
            </div>
        </div>
        
        <!-- 开班结课日期 -->
        <div class="class-detail-date">
            <div class="date-item">
                <div class="date-label">📆 开班日期</div>
                <div class="date-value">${startDate}</div>
            </div>
            <div class="date-divider"></div>
            <div class="date-item">
                <div class="date-label">🏁 结课日期</div>
                <div class="date-value">${endDate}</div>
            </div>
        </div>
        
        <!-- 上课时间 -->
        ${scheduleHtml}
        
        <!-- 学员列表 -->
        <div class="class-detail-section">
            <div class="class-detail-section-title">
                <span class="section-icon">👥</span>
                学员列表
                <span class="section-count">(${c.studentCount || 0}人)</span>
            </div>
            <div class="student-list">
                ${studentNames.split('、').filter(name => name !== '暂无学生').map(name => `
                    <div class="student-item">
                        <div class="student-avatar">${name.charAt(0)}</div>
                        <div class="student-name">${name}</div>
                    </div>
                `).join('') || '<div style="color: #999; font-size: 14px;">暂无学员</div>'}
            </div>
        </div>
    `;
    
    showModal('classDetailModal');
}

function toggleClassSection(sectionId) {
    const content = document.getElementById(sectionId + 'Content');
    const arrow = document.getElementById(sectionId + 'Arrow');
    if (content) {
        content.classList.toggle('expanded');
    }
    if (arrow) {
        arrow.classList.toggle('expanded');
    }
}

async function loadHomeworks() {
    await loadHomework();
}

async function loadHomework() {
    const res = await api('GET', '/homework');
    if (res.code === 200) {
        const homeworks = res.data || [];
        if (homeworks.length === 0) {
            document.getElementById('homeworkList').innerHTML = `
                <div style="padding:40px 16px;text-align:center;color:#999">暂无作业</div>
            `;
            return;
        }
        document.getElementById('homeworkList').innerHTML = homeworks.map(h => {
            const status = new Date(h.deadline) > new Date() ? '进行中' : '已截止';
            const statusClass = new Date(h.deadline) > new Date() ? 'badge-enrolling' : 'badge-paused';
            const cycleText = h.cycle?.type === 'multi' ? `${h.frequency?.timesPerCycle || 1}次/${h.cycle?.durationDays || 1}天` : '单周期';
            return `
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">${h.title}</div>
                        <span class="card-badge ${statusClass}">${status}</span>
                    </div>
                    <div class="card-meta">
                        <span class="card-meta-item">📚 ${h.courseId?.name || '--'}</span>
                        <span class="card-meta-item">👥 ${h.classId?.name || '--'}</span>
                    </div>
                    <div class="card-meta">
                        <span class="card-meta-item">📋 周期：${cycleText}</span>
                        <span class="card-meta-item">⭐ ${h.points || 0}积分</span>
                    </div>
                    <div class="card-meta">
                        <span class="card-meta-item">📅 截止：${formatDate(h.deadline)}</span>
                        ${h.hasCheckin ? '<span class="card-meta-item">✅ 含打卡</span>' : ''}
                    </div>
                    <div class="card-desc">${h.content || ''}</div>
                    <div style="margin-top:12px;display:flex;gap:8px">
                        <button class="btn btn-primary btn-sm" onclick="showHomeworkDetail('${h._id}')">📋 查看详情</button>
                        <button class="btn btn-outline btn-sm" onclick="showGradeModal('${h._id}')">✏️ 批改</button>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        document.getElementById('homeworkList').innerHTML = `
            <div style="padding:40px 16px;text-align:center;color:#999">加载失败</div>
        `;
    }
}

async function showHomeworkDetail(homeworkId) {
    const res = await api('GET', `/homework/${homeworkId}`);
    if (res.code !== 200) { showToast('获取作业详情失败', 'error'); return; }
    const h = res.data;
    document.getElementById('homeworkDetailTitle').textContent = h.title;
    
    const cycleText = h.cycle?.type === 'multi' ? `${h.frequency?.timesPerCycle || 1}次/${h.cycle?.durationDays || 1}天` : '单周期';
    const status = new Date(h.deadline) > new Date() ? '进行中' : '已截止';
    const statusClass = new Date(h.deadline) > new Date() ? 'badge-enrolling' : 'badge-paused';
    
    document.getElementById('homeworkDetailBody').innerHTML = `
        <div class="card-meta" style="margin-bottom:16px">
            <span class="card-badge ${statusClass}">${status}</span>
            <span class="card-meta-item">📚 ${h.courseId?.name || '--'}</span>
            <span class="card-meta-item">👥 ${h.classId?.name || '--'}</span>
        </div>
        <div style="margin-bottom:16px">
            <div style="font-size:14px;font-weight:600;margin-bottom:8px">作业内容</div>
            <div style="font-size:13px;color:#666;line-height:1.6">${h.content || '暂无内容'}</div>
        </div>
        <div style="margin-bottom:16px">
            <div style="font-size:14px;font-weight:600;margin-bottom:8px">作业设置</div>
            <div class="card-meta" style="flex-direction:column;gap:6px">
                <span>📋 周期：${cycleText}</span>
                <span>⭐ 完成积分：${h.points || 0}</span>
                <span>📅 截止时间：${formatDate(h.deadline)}</span>
                ${h.hasCheckin ? `<span>✅ 含打卡任务（每次${h.checkinPoints || 0}积分）</span>` : ''}
            </div>
        </div>
    `;
    showModal('homeworkDetailModal');
}

async function showGradeModal(homeworkId) {
    const res = await api('GET', `/homework/${homeworkId}/submissions`);
    if (res.code !== 200) { showToast('获取提交列表失败', 'error'); return; }
    const submissions = res.data || [];
    
    let submissionsHtml = '';
    if (submissions.length === 0) {
        submissionsHtml = '<div style="padding:20px;text-align:center;color:#999">暂无提交记录</div>';
    } else {
        submissionsHtml = submissions.map(s => {
            const gradeMap = { A: '优秀', B: '良好', C: '合格', D: '需改进' };
            const gradeClass = { A: 'badge-enrolling', B: 'badge-ongoing', C: 'badge-paused', D: 'badge-ended' };
            return `
                <div class="submission-item">
                    <div style="flex:1">
                        <div style="font-weight:500">${s.studentName || s.studentId?.name || '学员'}</div>
                        <div style="font-size:12px;color:#999;margin-top:4px">提交时间：${formatDate(s.submittedAt)}</div>
                    </div>
                    ${s.grade ? `
                        <span class="card-badge ${gradeClass[s.grade] || ''}">${s.grade} ${gradeMap[s.grade] || ''}</span>
                        <button class="btn btn-outline btn-sm" onclick="openGradeModal('${s._id}','${s.studentName || '学员'}')">重新批改</button>
                    ` : `
                        <button class="btn btn-primary btn-sm" onclick="openGradeModal('${s._id}','${s.studentName || '学员'}')">去批改</button>
                    `}
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('homeworkDetailTitle').textContent = '作业批改';
    document.getElementById('homeworkDetailBody').innerHTML = `
        <div style="margin-bottom:16px">
            <div style="font-size:14px;font-weight:600;margin-bottom:8px">待批改列表 (${submissions.length}人)</div>
            <div class="submission-list">${submissionsHtml}</div>
        </div>
    `;
    showModal('homeworkDetailModal');
}

let currentSubmissionId = '';

function openGradeModal(submissionId, studentName) {
    currentSubmissionId = submissionId;
    document.getElementById('submissionInfo').innerHTML = `<p>正在批改：<strong>${studentName}</strong> 的作业</p>`;
    document.querySelectorAll('.grade-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('gradeComment').value = '';
    document.getElementById('gradeBonusPoints').value = '0';
    showModal('gradeModal');
}

function selectGrade(btn) {
    document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

async function submitGrade() {
    const selectedBtn = document.querySelector('.grade-btn.selected');
    if (!selectedBtn) {
        showToast('请选择评级', 'error');
        return;
    }
    
    const grade = selectedBtn.dataset.grade;
    const comment = document.getElementById('gradeComment').value.trim();
    const bonusPoints = parseInt(document.getElementById('gradeBonusPoints').value) || 0;
    
    const res = await api('PUT', `/homework/submission/${currentSubmissionId}/grade`, {
        grade,
        comment,
        bonusPoints
    });
    
    if (res.code === 200) {
        showToast('批改成功', 'success');
        hideModal('gradeModal');
    } else {
        showToast(res.message || '批改失败', 'error');
    }
}

function loadCheckins() {
    loadCheckinsData();
}

function loadPointsRanking() {
    loadPoints();
}

async function loadCheckinsData() {
    const res = await api('GET', '/checkin');
    if (res.code === 200) {
        const checkins = res.data || [];
        const today = new Date().toDateString();
        const todayCount = checkins.filter(c => new Date(c.checkinDate).toDateString() === today).length;
        
        document.getElementById('checkinStats').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${checkins.length}</div>
                <div class="stat-label">总打卡次数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${todayCount}</div>
                <div class="stat-label">今日打卡</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">--</div>
                <div class="stat-label">平均连续天数</div>
            </div>
        `;
        
        if (checkins.length === 0) {
            document.getElementById('checkinList').innerHTML = `
                <div style="padding:40px 16px;text-align:center;color:#999">暂无打卡记录</div>
            `;
        } else {
            document.getElementById('checkinList').innerHTML = checkins.map(c => `
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">打卡记录</div>
                        <span class="card-badge badge-ongoing">已打卡</span>
                    </div>
                    <div class="card-meta">
                        <span class="card-meta-item">📅 ${formatDate(c.checkinDate)}</span>
                    </div>
                </div>
            `).join('');
        }
    } else {
        document.getElementById('checkinList').innerHTML = `
            <div style="padding:40px 16px;text-align:center;color:#999">加载失败</div>
        `;
    }
}

async function loadPoints() {
    const res = await api('GET', '/points/teacher/stats');
    if (res.code === 200) {
        const data = res.data;
        document.getElementById('pointsStats').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${data.totalStudents || 0}</div>
                <div class="stat-label">学员总数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.totalEarned || 0}</div>
                <div class="stat-label">积分发放总量</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.totalSpent || 0}</div>
                <div class="stat-label">积分消耗总量</div>
            </div>
        `;
        
        const ranking = data.ranking || [];
        if (ranking.length === 0) {
            document.getElementById('pointsRankingList').innerHTML = `
                <div style="padding:40px 16px;text-align:center;color:#999">暂无积分排行</div>
            `;
        } else {
            document.getElementById('pointsRankingList').innerHTML = ranking.map((s, i) => `
                <div class="card">
                    <div class="card-header">
                        <span class="rank-badge rank-${i + 1}">${i + 1}</span>
                        <span style="font-size:24px;margin-right:8px">${s.avatar || '👤'}</span>
                        <div class="card-title">${s.name}</div>
                    </div>
                    <div class="card-meta">
                        <span class="card-meta-item">⭐ ${s.points} 积分</span>
                    </div>
                </div>
            `).join('');
        }
    } else {
        document.getElementById('pointsRankingList').innerHTML = `
            <div style="padding:40px 16px;text-align:center;color:#999">加载失败</div>
        `;
    }
}

async function loadProfile() {
    const profileHtml = `
        <div style="margin-bottom:16px">
            <div style="font-size:14px;font-weight:600;margin-bottom:8px">基本信息</div>
            <div class="card-meta" style="flex-direction:column;gap:6px">
                <span>📱 手机号：13800138000</span>
                <span>📧 微信：TeacherLi</span>
                <span>🎂 入职日期：2023-09-01</span>
                <span>💼 职位：高级教师</span>
            </div>
        </div>
    `;
    const el = document.getElementById('profileInfo');
    if (el) el.innerHTML = profileHtml;
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === tabId);
    });
    if (tabId === 'courses') loadCourses();
    if (tabId === 'classes') loadClasses();
    if (tabId === 'homework') loadHomeworks();
    if (tabId === 'checkins') loadCheckins();
    if (tabId === 'points') loadPointsRanking();
}

async function loadHomeworks() {
    await loadHomework();
}

function loadCheckins() {
    loadCheckinsData();
}

function loadPointsRanking() {
    loadPoints();
}

async function loadCheckinsData() {
    const res = await api('GET', '/checkin');
    if (res.code === 200) {
        const checkins = res.data || [];
        const today = new Date().toDateString();
        const todayCount = checkins.filter(c => new Date(c.checkinDate).toDateString() === today).length;
        
        document.getElementById('checkinStats').innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${checkins.length}</div>
                <div class="stat-label">总打卡次数</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${todayCount}</div>
                <div class="stat-label">今日打卡</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">--</div>
                <div class="stat-label">平均连续天数</div>
            </div>
        `;
        
        if (checkins.length === 0) {
            document.getElementById('checkinList').innerHTML = `
                <div style="padding:40px 16px;text-align:center;color:#999">暂无打卡记录</div>
            `;
        } else {
            document.getElementById('checkinList').innerHTML = checkins.map(c => `
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">打卡记录</div>
                        <span class="card-badge badge-ongoing">已打卡</span>
                    </div>
                    <div class="card-meta">
                        <span class="card-meta-item">📅 ${formatDate(c.checkinDate)}</span>
                    </div>
                </div>
            `).join('');
        }
    } else {
        document.getElementById('checkinList').innerHTML = `
            <div style="padding:40px 16px;text-align:center;color:#999">加载失败</div>
        `;
    }
}

function toggleAvatarModal() {
    const modal = document.getElementById('avatarModal');
    if (modal) modal.classList.toggle('show');
}

function previewAvatar() {
    const input = document.getElementById('avatarInput');
    const preview = document.getElementById('avatarPreview');
    if (input && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function saveAvatar() {
    const preview = document.getElementById('avatarPreview');
    if (preview && preview.src) {
        const avatar = preview.src;
        document.querySelectorAll('.avatar').forEach(el => {
            if (el.tagName === 'IMG') el.src = avatar;
            else el.style.backgroundImage = `url(${avatar})`;
        });
        showToast('头像更新成功', 'success');
    }
    toggleAvatarModal();
}

window.onload = function() {
    loadCourses();
    loadProfile();
};
