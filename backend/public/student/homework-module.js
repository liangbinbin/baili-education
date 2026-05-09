// 作业模块 - homework-module.js
// 负责作业列表渲染和事件处理

let homeworkModuleConfig = {
    containerId: 'homeworkList',
    checkinContainerId: 'checkinHomeworkList'
};

export function initHomeworkModule() {
    console.log('📚 Homework module initialized');
    bindHomeworkEvents();
}

function bindHomeworkEvents() {
    document.addEventListener('click', handleHomeworkClick);
}

function handleHomeworkClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    
    const action = el.dataset.action;
    const id = el.dataset.id || el.dataset.homework;
    
    if (!id) {
        console.warn('⚠️ No ID found for action:', action);
        return;
    }
    
    console.log('🔍 Homework action:', action, 'ID:', id);
    
    switch(action) {
        case 'cycle-toggle':
            toggleCycles(id);
            break;
        case 'complete':
            handleHomeworkComplete(id);
            break;
        case 'share':
            openHomeworkShareModal(id);
            break;
        case 'pending':
            handlePendingAction(id);
            break;
        case 'toggle-times':
            const cycleIdx = parseInt(el.dataset.cycle) || 0;
            toggleTimesList(id, cycleIdx);
            break;
        case 'submit':
        case 'view':
            const cIdx = parseInt(el.dataset.cycle) || 0;
            const tIdx = parseInt(el.dataset.time) || 0;
            openUploadModal(id, cIdx, tIdx);
            break;
        case 'checkin':
            handleCheckinAction(id);
            break;
        case 'makeup-checkin':
            handleMakeupCheckin(id);
            break;
        case 'checkin-share':
            openCheckinShareModal(id);
            break;
        case 'checkin-direct':
            locateCurrentCheckin(id);
            break;
        case 'makeup-direct':
            locateMakeupCheckin(id);
            break;
        case 'checkin-share-direct':
            openCheckinShareModal(id);
            break;
        default:
            console.warn('⚠️ Unknown action:', action);
    }
}

export function renderHomeworkList(homeworks) {
    const container = document.getElementById(homeworkModuleConfig.containerId);
    if (!container) {
        console.error('❌ Container not found:', homeworkModuleConfig.containerId);
        return;
    }
    
    const pending = homeworks.filter(h => !h.isCompleted);
    const completed = homeworks.filter(h => h.isCompleted);
    
    let html = '';
    
    if (pending.length > 0) {
        html += `<div class="section-header" style="background: #FAFAFA; font-weight: 600; color: #666; padding: 12px 16px; border-radius: 8px 8px 0 0;">📋 待完成 (${pending.length})</div>`;
        html += pending.map(h => renderHomeworkCard(h)).join('');
    }
    
    if (completed.length > 0) {
        html += `<div class="section-header" style="background: #F6FFED; font-weight: 600; color: #52C41A; padding: 12px 16px; border-radius: 8px 8px 0 0; margin-top: 16px;">✅ 已完成 (${completed.length})</div>`;
        html += completed.map(h => renderHomeworkCard(h)).join('');
    }
    
    if (!html) {
        html = '<div class="empty-state"><div class="empty-icon">📝</div><div class="empty-text">暂无作业</div></div>';
    }
    
    container.innerHTML = html;
}

function renderHomeworkCard(homework) {
    const { completedTimes, totalTaskCount, completedCycles, cycles, className, homeworkTypeText, homeworkTypeClass, statusBadge, isCompleted } = buildHomeworkInfo(homework);
    
    const badges = `
        <span class="card-badge badge-class">🏫 ${className}</span>
        <span class="card-badge ${homeworkTypeClass}">${homeworkTypeText}</span>
        <span class="card-badge ${isCompleted ? 'badge-success' : 'badge-warning'}" data-action="pending" data-id="${homework._id}" style="cursor: pointer;">${statusBadge}</span>
    `;
    
    const metaInfo = `
        <span>📅 ${homework.publishTime} ~ ${homework.deadline}（${calculateDays(homework)}天）</span>
        <span>⚡ 作业频率：${getFrequencyText(homework)}</span>
    `;
    
    const progressSection = homework.cycle?.type === 'multi' ? `
        <div class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.round((completedTimes / totalTaskCount) * 100)}%"></div>
            </div>
            <div class="progress-info">
                <span class="cycle-progress">周期 ${completedCycles}/${cycles}</span>
                <button class="btn-toggle" data-action="cycle-toggle" data-id="${homework._id}">
                    <span>▼</span>
                </button>
            </div>
        </div>
    ` : '';
    
    const actionButtons = homework.hasCheckin ? renderCheckinButtons(homework) : renderHomeworkButtons(homework);
    
    const cyclesList = homework.cycle?.type === 'multi' ? renderCyclesList(homework) : '';
    
    return `
        <div class="homework-card" data-homework-id="${homework._id}">
            <div class="card-header">
                <h3 class="card-title">${homework.title}</h3>
                <div class="card-badges">${badges}</div>
            </div>
            <div class="card-content">
                <p class="card-description">${homework.content}</p>
                ${progressSection}
                <div class="card-meta">${metaInfo}</div>
            </div>
            <div class="card-actions">${actionButtons}</div>
            ${cyclesList}
        </div>
    `;
}

function buildHomeworkInfo(h) {
    const cycles = h.cyclesData?.length || 1;
    const timesPerCycle = h.frequency?.timesPerCycle || 1;
    const totalTaskCount = cycles * timesPerCycle;
    
    return {
        completedTimes: h.completedTimes || 0,
        totalTaskCount,
        completedCycles: h.completedCycles || 0,
        cycles,
        className: h.classId?.name || '未知班级',
        homeworkTypeText: h.hasCheckin ? '打卡作业' : (h.cycle?.type === 'multi' ? '周期作业' : '单次作业'),
        homeworkTypeClass: h.hasCheckin ? 'badge-checkin' : (h.cycle?.type === 'multi' ? 'badge-period' : 'badge-single'),
        statusBadge: h.isCompleted ? '已完成' : `待完成 ${h.completedTimes || 0}/${totalTaskCount}`,
        isCompleted: h.isCompleted || false
    };
}

function renderHomeworkButtons(homework) {
    return `
        <button class="btn btn-primary" data-action="complete" data-id="${homework._id}">完成作业</button>
        <button class="btn btn-success" data-action="share" data-id="${homework._id}">📤 分享</button>
    `;
}

function renderCheckinButtons(homework) {
    const canCheckin = (homework.completedTimes || 0) < (homework.cyclesData?.length || 1) * (homework.frequency?.timesPerCycle || 1);
    
    return `
        ${canCheckin ? `
            <button class="btn btn-primary" data-action="checkin" data-id="${homework._id}">立即打卡</button>
        ` : `
            <button class="btn btn-secondary" disabled>本周期已完成</button>
        `}
        <button class="btn btn-warning" data-action="makeup-checkin" data-id="${homework._id}">🕓 补打卡</button>
        <button class="btn btn-success" data-action="checkin-share" data-id="${homework._id}">📤 分享</button>
    `;
}

function renderCyclesList(homework) {
    if (!homework.cyclesData) return '';
    
    return `
        <div class="cycles-container" id="cycles-${homework._id}">
            ${homework.cyclesData.map((cycle, idx) => `
                <div class="cycle-item" data-cycle-index="${idx}">
                    <div class="cycle-header" data-action="toggle-times" data-id="${homework._id}" data-cycle="${idx}">
                        <span class="cycle-name">周期 ${idx + 1}/${homework.cyclesData.length}</span>
                        <span class="cycle-date">${cycle.start} ~ ${cycle.end}</span>
                        <span class="cycle-status ${cycle.isCompleted ? 'status-completed' : 'status-pending'}">
                            ${cycle.isCompleted ? '已完成' : '进行中'}
                        </span>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="times-list" id="times-${homework._id}-${idx}">
                        ${cycle.times.map((time, tIdx) => `
                            <div class="time-item">
                                <span class="time-label">第${tIdx + 1}次</span>
                                <span class="time-status">${time.completed ? '✅' : '⏳'}</span>
                                ${time.completed ? `
                                    <button class="btn btn-xs btn-view" data-action="view" data-id="${homework._id}" data-cycle="${idx}" data-time="${tIdx}">查看</button>
                                ` : `
                                    <button class="btn btn-xs btn-submit" data-action="submit" data-id="${homework._id}" data-cycle="${idx}" data-time="${tIdx}">提交</button>
                                `}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function calculateDays(homework) {
    const start = new Date(homework.publishTime);
    const end = new Date(homework.deadline);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

function getFrequencyText(homework) {
    const freq = homework.frequency;
    if (!freq) return '未知';
    return `${freq.timesPerCycle}次/${freq.durationDays}天`;
}

// 需要从主文件继承的函数
function toggleCycles(id) {
    const container = document.getElementById(`cycles-${id}`);
    if (container) {
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    }
}

function toggleTimesList(id, cycleIdx) {
    const list = document.getElementById(`times-${id}-${cycleIdx}`);
    if (list) {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    }
}

// 以下函数需要在主文件中定义
function handleHomeworkComplete(id) { /* ... */ }
function openHomeworkShareModal(id) { /* ... */ }
function handlePendingAction(id) { /* ... */ }
function openUploadModal(id, cycleIdx, timeIdx) { /* ... */ }
function handleCheckinAction(id) { /* ... */ }
function handleMakeupCheckin(id) { /* ... */ }
function openCheckinShareModal(id) { /* ... */ }
function locateCurrentCheckin(id) { /* ... */ }
function locateMakeupCheckin(id) { /* ... */ }