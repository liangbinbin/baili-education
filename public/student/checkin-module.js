// 打卡模块 - checkin-module.js
// 负责打卡列表渲染和事件处理

let checkinModuleConfig = {
    containerId: 'checkinHomeworkList',
    statsContainerId: 'checkinStats'
};

export function initCheckinModule() {
    console.log('✅ Checkin module initialized');
    bindCheckinEvents();
}

function bindCheckinEvents() {
    document.addEventListener('click', handleCheckinClick);
}

function handleCheckinClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    
    const action = el.dataset.action;
    const id = el.dataset.id || el.dataset.homework;
    
    if (!id) {
        console.warn('⚠️ No ID found for checkin action:', action);
        return;
    }
    
    console.log('🔍 Checkin action:', action, 'ID:', id);
    
    switch(action) {
        case 'checkin-direct':
            handleDirectCheckin(id);
            break;
        case 'makeup-direct':
            handleDirectMakeup(id);
            break;
        case 'checkin-share-direct':
            openCheckinShareModal(id);
            break;
        case 'view-checkin':
            viewCheckinRecord(id);
            break;
        default:
            console.warn('⚠️ Unknown checkin action:', action);
    }
}

export function renderCheckinList(checkins) {
    const container = document.getElementById(checkinModuleConfig.containerId);
    if (!container) {
        console.error('❌ Checkin container not found:', checkinModuleConfig.containerId);
        return;
    }
    
    if (!checkins || checkins.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-text">暂无打卡作业</div></div>';
        return;
    }
    
    const html = checkins.map(c => renderCheckinCard(c)).join('');
    container.innerHTML = html;
}

function renderCheckinCard(checkin) {
    const progress = calculateCheckinProgress(checkin);
    
    return `
        <div class="checkin-card" data-checkin-id="${checkin._id}">
            <div class="checkin-header">
                <h3 class="checkin-title">${checkin.title}</h3>
                <span class="checkin-badge badge-checkin">打卡作业</span>
            </div>
            <div class="checkin-content">
                <div class="checkin-progress">
                    <div class="progress-circle">
                        <span class="progress-value">${progress.percentage}%</span>
                    </div>
                    <div class="progress-info">
                        <span>累计打卡 ${progress.completed}/${progress.total} 次</span>
                        <span>连续 ${progress.streak} 天</span>
                    </div>
                </div>
                <div class="checkin-meta">
                    <span>📅 ${checkin.publishTime} ~ ${checkin.deadline}</span>
                    <span>⚡ ${checkin.frequency?.timesPerCycle || 1}次/${checkin.frequency?.durationDays || 1}天</span>
                </div>
            </div>
            <div class="checkin-actions">
                ${progress.canCheckin ? `
                    <button class="btn btn-primary" data-action="checkin-direct" data-id="${checkin._id}">立即打卡</button>
                ` : `
                    <button class="btn btn-secondary" disabled>今日已完成</button>
                `}
                <button class="btn btn-warning" data-action="makeup-direct" data-id="${checkin._id}">🕓 补打卡</button>
                <button class="btn btn-success" data-action="checkin-share-direct" data-id="${checkin._id}">📤 分享</button>
            </div>
        </div>
    `;
}

function calculateCheckinProgress(checkin) {
    const total = (checkin.cyclesData?.length || 1) * (checkin.frequency?.timesPerCycle || 1);
    const completed = checkin.completedTimes || 0;
    const percentage = Math.round((completed / total) * 100);
    
    return {
        completed,
        total,
        percentage,
        streak: checkin.currentStreak || 0,
        canCheckin: completed < total
    };
}

export function updateCheckinStats(stats) {
    const elements = {
        totalCheckins: document.getElementById('totalCheckins'),
        currentStreak: document.getElementById('currentStreak'),
        maxStreak: document.getElementById('maxStreak'),
        todayCheckin: document.getElementById('todayCheckin')
    };
    
    Object.entries(elements).forEach(([key, el]) => {
        if (el && stats[key] !== undefined) {
            el.textContent = stats[key];
        }
    });
}

function handleDirectCheckin(id) {
    console.log('📝 Direct checkin:', id);
    // 定位到打卡位置并执行打卡
    const card = document.querySelector(`[data-checkin-id="${id}"]`);
    if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // 触发打卡逻辑
    performCheckin(id);
}

function handleDirectMakeup(id) {
    console.log('⏳ Makeup checkin:', id);
    // 打开补打卡界面
    openMakeupModal(id);
}

function viewCheckinRecord(id) {
    console.log('👁️ View checkin record:', id);
}

// 需要从主文件继承的函数
function openCheckinShareModal(id) { /* ... */ }
function performCheckin(id) { /* ... */ }
function openMakeupModal(id) { /* ... */ }