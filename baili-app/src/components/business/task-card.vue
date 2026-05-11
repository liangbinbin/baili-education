&lt;template&gt;
  &lt;view class="task-card" @click="handleClick"&gt;
    &lt;view class="task-card__header"&gt;
      &lt;view class="task-card__type-tag" :class="`task-card__type-tag--${task.type}`"&gt;
        &lt;text&gt;{{ taskTypeText }}&lt;/text&gt;
      &lt;/view&gt;
      &lt;view v-if="task.frequencyMode" class="task-card__frequency-tag" :class="`task-card__frequency-tag--${task.frequencyMode}`"&gt;
        &lt;text&gt;{{ frequencyText }}&lt;/text&gt;
      &lt;/view&gt;
      &lt;view :class="['task-card__status-badge', `task-card__status-badge--${statusClass}`]"&gt;
        &lt;text&gt;{{ statusText }}&lt;/text&gt;
      &lt;/view&gt;
    &lt;/view&gt;
    
    &lt;view class="task-card__body"&gt;
      &lt;text class="task-card__title"&gt;{{ task.title }}&lt;/text&gt;
      &lt;view class="task-card__meta"&gt;
        &lt;text v-if="task.classIds &amp;&amp; task.classIds.length &gt; 0" class="task-card__class"&gt;{{ task.classIds[0].name }}&lt;/text&gt;
        &lt;text class="task-card__date"&gt;{{ formatDate(task.startDate) }} - {{ formatDate(task.endDate) }}&lt;/text&gt;
      &lt;/view&gt;
    &lt;/view&gt;
    
    &lt;view v-if="task.progress" class="task-card__progress"&gt;
      &lt;view class="task-card__progress-info"&gt;
        &lt;text class="task-card__progress-text"&gt;进度：{{ task.progress.completedDays || 0 }}/{{ task.progress.totalDays || 0 }}&lt;/text&gt;
        &lt;text v-if="task.completionPoints" class="task-card__points"&gt;+{{ task.completionPoints }}积分&lt;/text&gt;
      &lt;/view&gt;
      &lt;view class="task-card__progress-bar"&gt;
        &lt;view class="task-card__progress-fill" :style="{ width: (task.progress.percentage || 0) + '%' }"&gt;&lt;/view&gt;
      &lt;/view&gt;
    &lt;/view&gt;
    
    &lt;view class="task-card__footer" @click.stop v-if="showActions"&gt;
      &lt;view v-for="action in actions" :key="action.type" 
            :class="['task-card__btn', `task-card__btn--${action.class}`]"
            @click="handleAction(action)"&gt;
        &lt;text&gt;{{ action.text }}&lt;/text&gt;
      &lt;/view&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
/**
 * 任务卡片组件（统一作业和打卡）
 */
import { computed } from 'vue'

// ========== Props ==========
const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

// ========== Emits ==========
const emit = defineEmits(['click', 'submit', 'share'])

// ========== 计算属性 ==========
const taskTypeText = computed(() =&gt; {
  return props.task.type === 'homework' ? '作业' : '打卡'
})

const frequencyText = computed(() =&gt; {
  const map = {
    'daily-once': '每日一次',
    'daily-multi': '每日多次',
    'weekly-fixed': '每周固定'
  }
  return map[props.task.frequencyMode] || ''
})

const statusClass = computed(() =&gt; {
  const task = props.task
  const now = new Date()
  const startDate = new Date(task.startDate)
  const endDate = new Date(task.endDate)

  if (now &lt; startDate) {
    return 'pending'
  }
  if (now &gt; endDate) {
    return 'overdue'
  }
  if (task.progress &amp;&amp; task.progress.completedDays &gt;= task.progress.totalDays) {
    return 'completed'
  }
  return 'pending'
})

const statusText = computed(() =&gt; {
  const map = {
    pending: '进行中',
    completed: '已完成',
    overdue: '已结束'
  }
  return map[statusClass.value] || '未知'
})

const actions = computed(() =&gt; {
  const task = props.task
  const status = statusClass.value
  const result = []

  if (status === 'overdue') {
    result.push({ text: '已结束', type: 'disabled', class: 'disabled' })
    return result
  }

  if (status === 'completed') {
    result.push({ text: '查看详情', type: 'detail', class: 'outline' })
    if (task.type === 'homework') {
      result.push({ text: '分享', type: 'share', class: 'outline' })
    }
    return result
  }

  const canSubmit = task.todaySubmission ? !task.todaySubmission.submitted : true
  
  if (canSubmit) {
    result.push({ 
      text: task.type === 'checkin' ? '立即打卡' : '立即完成', 
      type: 'submit', 
      class: 'primary' 
    })
  } else {
    result.push({ text: '今日已完成', type: 'disabled', class: 'disabled' })
  }

  if (task.type === 'checkin') {
    result.push({ text: '分享', type: 'share', class: 'outline' })
  }

  return result
})

// ========== 方法 ==========
const formatDate = (dateStr) =&gt; {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}.${d.getDate()}`
}

const handleClick = () =&gt; {
  emit('click', props.task)
}

const handleAction = (action) =&gt; {
  if (action.type === 'submit') {
    emit('submit', props.task)
  } else if (action.type === 'share') {
    emit('share', props.task)
  } else if (action.type === 'detail') {
    emit('click', props.task)
  }
}
&lt;/script&gt;

&lt;style lang="scss" scoped&gt;
@import '@/styles/variables.scss';

.task-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-default;
  
  &amp;__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: $spacing-md;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
  
  &amp;__type-tag {
    display: inline-flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;
    
    &amp;--homework {
      background: $color-primary-light;
      color: $color-primary;
    }
    
    &amp;--checkin {
      background: $color-checkin-light;
      color: $color-checkin;
    }
  }

  &amp;__frequency-tag {
    display: inline-flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;
    
    &amp;--daily-once {
      background: $color-info-light;
      color: $color-info;
    }
    
    &amp;--daily-multi {
      background: $color-success-light;
      color: $color-success;
    }
    
    &amp;--weekly-fixed {
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7;
    }
  }
  
  &amp;__status-badge {
    display: inline-flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;
    
    &amp;--pending {
      background: $color-primary-light;
      color: $color-primary;
    }
    
    &amp;--completed {
      background: $color-success-light;
      color: $color-success;
    }
    
    &amp;--overdue {
      background: $color-border-light;
      color: $color-text-placeholder;
    }
  }
  
  &amp;__body {
    margin-bottom: $spacing-md;
  }
  
  &amp;__title {
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    display: block;
    margin-bottom: $spacing-sm;
    line-height: 1.5;
  }
  
  &amp;__meta {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
    font-size: $font-size-body;
    color: $color-text-secondary;
  }
  
  &amp;__class {
    color: $color-text-secondary;
  }
  
  &amp;__date {
    color: $color-text-secondary;
  }

  &amp;__progress {
    margin-bottom: $spacing-md;
    
    &amp;-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;
    }
    
    &amp;-text {
      font-size: $font-size-body;
      color: $color-text-secondary;
    }
    
    &amp;-points {
      font-size: $font-size-body;
      font-weight: $font-weight-semibold;
      color: $color-primary;
    }
    
    &amp;-bar {
      width: 100%;
      height: 12rpx;
      background: $color-border-light;
      border-radius: 999rpx;
      overflow: hidden;
    }
    
    &amp;-fill {
      height: 100%;
      background: linear-gradient(90deg, $color-primary 0%, #ff8a5b 100%);
      border-radius: 999rpx;
      transition: width 0.3s ease;
    }
  }
  
  &amp;__footer {
    display: flex;
    gap: $spacing-md;
  }
  
  &amp;__btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-md $spacing-xl;
    border-radius: $radius-button;
    font-size: $font-size-body;
    font-weight: $font-weight-medium;
    
    &amp;--primary {
      background: linear-gradient(135deg, $color-primary 0%, #ff8a5b 100%);
      color: $color-text-white;
    }
    
    &amp;--outline {
      background: transparent;
      border: 2rpx solid $color-border;
      color: $color-text-primary;
    }
    
    &amp;--disabled {
      background: $color-border-light;
      color: $color-text-placeholder;
    }
  }
}
&lt;/style&gt;
