&lt;template&gt;
  &lt;view class="task-card" @click="handleClick"&gt;
    &lt;view class="task-header"&gt;
      &lt;view class="task-title-wrapper"&gt;
        &lt;view class="task-type" :class="task.type"&gt;
          &lt;text v-if="task.type === 'homework'"&gt;📝 作业&lt;/text&gt;
          &lt;text v-else&gt;🔥 打卡&lt;/text&gt;
        &lt;/view&gt;
        &lt;view v-if="task.frequencyMode" class="task-frequency" :class="task.frequencyMode"&gt;
          &lt;text v-if="task.frequencyMode === 'daily-once'"&gt;每日一次&lt;/text&gt;
          &lt;text v-else-if="task.frequencyMode === 'daily-multi'"&gt;每日多次&lt;/text&gt;
          &lt;text v-else&gt;每周固定&lt;/text&gt;
        &lt;/view&gt;
        &lt;view class="task-status" :class="statusInfo.class"&gt;
          &lt;text&gt;{{ statusInfo.text }}&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;
      &lt;text class="task-title"&gt;{{ task.title }}&lt;/text&gt;
    &lt;/view&gt;

    &lt;view class="task-info"&gt;
      &lt;view class="info-item" v-if="task.classIds &amp;&amp; task.classIds.length &gt; 0"&gt;
        &lt;text class="info-label"&gt;👥&lt;/text&gt;
        &lt;text class="info-text"&gt;{{ task.classIds[0].name }}&lt;/text&gt;
      &lt;/view&gt;
      &lt;view class="info-item"&gt;
        &lt;text class="info-label"&gt;📅&lt;/text&gt;
        &lt;text class="info-text"&gt;{{ formatDate(task.startDate) }} - {{ formatDate(task.endDate) }}&lt;/text&gt;
      &lt;/view&gt;
    &lt;/view&gt;

    &lt;view v-if="task.progress" class="progress-section"&gt;
      &lt;view class="progress-info"&gt;
        &lt;text class="progress-text"&gt;进度：{{ task.progress.completedDays || 0 }}/{{ task.progress.totalDays || 0 }}&lt;/text&gt;
        &lt;text v-if="task.completionPoints" class="points-text"&gt;+{{ task.completionPoints }}积分&lt;/text&gt;
      &lt;/view&gt;
      &lt;view class="progress-bar"&gt;
        &lt;view class="progress-fill" :style="{ width: (task.progress.percentage || 0) + '%' }"&gt;&lt;/view&gt;
      &lt;/view&gt;
    &lt;/view&gt;

    &lt;view class="task-actions" v-if="showActions"&gt;
      &lt;view v-for="action in actions" :key="action.type" 
            class="action-btn" 
            :class="action.class"
            @click.stop="handleAction(action)"&gt;
        &lt;text&gt;{{ action.text }}&lt;/text&gt;
      &lt;/view&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { computed } from 'vue'

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

const emit = defineEmits(['click', 'submit', 'share'])

const formatDate = (dateStr) =&gt; {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}.${day}`
}

const statusInfo = computed(() =&gt; {
  const task = props.task
  const now = new Date()
  const startDate = new Date(task.startDate)
  const endDate = new Date(task.endDate)

  if (now &lt; startDate) {
    return { text: '未开始', class: 'not-started' }
  }
  if (now &gt; endDate) {
    return { text: '已结束', class: 'ended' }
  }
  if (task.progress &amp;&amp; task.progress.completedDays &gt;= task.progress.totalDays) {
    return { text: '已完成', class: 'completed' }
  }
  return { text: '进行中', class: 'active' }
})

const actions = computed(() =&gt; {
  const task = props.task
  const status = statusInfo.value
  const result = []

  if (status.class === 'not-started' || status.class === 'ended') {
    result.push({ text: status.text, type: 'disabled', class: 'disabled' })
    return result
  }

  if (status.class === 'completed') {
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

  .task-header {
    margin-bottom: $spacing-md;

    .task-title-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;
      align-items: center;
    }

    .task-type {
      display: inline-flex;
      align-items: center;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-tag;
      font-size: $font-size-caption;
      font-weight: $font-weight-medium;

      &amp;.homework {
        background: $color-primary-light;
        color: $color-primary;
      }

      &amp;.checkin {
        background: $color-checkin-light;
        color: $color-checkin;
      }
    }

    .task-frequency {
      display: inline-flex;
      align-items: center;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-tag;
      font-size: $font-size-caption;
      font-weight: $font-weight-medium;

      &amp;.daily-once {
        background: $color-info-light;
        color: $color-info;
      }

      &amp;.daily-multi {
        background: $color-success-light;
        color: $color-success;
      }

      &amp;.weekly-fixed {
        background: rgba(168, 85, 247, 0.1);
        color: #a855f7;
      }
    }

    .task-status {
      display: inline-flex;
      align-items: center;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-tag;
      font-size: $font-size-caption;
      font-weight: $font-weight-medium;

      &amp;.not-started {
        background: $color-border-light;
        color: $color-text-placeholder;
      }

      &amp;.active {
        background: $color-primary-light;
        color: $color-primary;
      }

      &amp;.completed {
        background: $color-success-light;
        color: $color-success;
      }

      &amp;.ended {
        background: $color-border-light;
        color: $color-text-placeholder;
      }
    }

    .task-title {
      display: block;
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      line-height: 1.5;
    }
  }

  .task-info {
    margin-bottom: $spacing-md;

    .info-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-xs;

      .info-label {
        font-size: 28rpx;
      }

      .info-text {
        font-size: $font-size-body;
        color: $color-text-secondary;
      }
    }
  }

  .progress-section {
    margin-bottom: $spacing-md;

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;

      .progress-text {
        font-size: $font-size-body;
        color: $color-text-secondary;
      }

      .points-text {
        font-size: $font-size-body;
        font-weight: $font-weight-semibold;
        color: $color-primary;
      }
    }

    .progress-bar {
      width: 100%;
      height: 12rpx;
      background: $color-border-light;
      border-radius: 999rpx;
      overflow: hidden;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, $color-primary 0%, #ff8a5b 100%);
        border-radius: 999rpx;
        transition: width 0.3s ease;
      }
    }
  }

  .task-actions {
    display: flex;
    gap: $spacing-md;

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: $spacing-md $spacing-xl;
      border-radius: $radius-button;
      font-size: $font-size-body;
      font-weight: $font-weight-medium;

      &amp;.primary {
        background: linear-gradient(135deg, $color-primary 0%, #ff8a5b 100%);
        color: $color-text-white;
      }

      &amp;.outline {
        background: transparent;
        border: 2rpx solid $color-border;
        color: $color-text-primary;
      }

      &amp;.disabled {
        background: $color-border-light;
        color: $color-text-placeholder;
      }
    }
  }
}
&lt;/style&gt;
