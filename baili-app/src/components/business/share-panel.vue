&lt;template&gt;
  &lt;view class="share-panel-mask" @click="handleClose"&gt;
    &lt;view class="share-panel" @click.stop&gt;
      &lt;view class="share-header"&gt;
        &lt;text class="share-title"&gt;分享到&lt;/text&gt;
      &lt;/view&gt;

      &lt;view class="share-preview" v-if="task"&gt;
        &lt;view class="preview-content"&gt;
          &lt;text class="preview-title"&gt;{{ shareContent.title }}&lt;/text&gt;
          &lt;text class="preview-desc"&gt;{{ shareContent.desc }}&lt;/text&gt;
        &lt;/view&gt;
        &lt;view class="preview-image"&gt;
          &lt;text class="image-placeholder"&gt;🏆&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view class="share-options"&gt;
        &lt;view class="share-option" 
              v-for="option in shareOptions" 
              :key="option.type"
              :class="{ disabled: isOptionDisabled(option) }"
              @click="handleShare(option)"&gt;
          &lt;view class="option-icon" :class="option.type"&gt;
            &lt;text&gt;{{ option.icon }}&lt;/text&gt;
          &lt;/view&gt;
          &lt;text class="option-label"&gt;{{ option.label }}&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;

      &lt;view v-if="showShareLimit" class="share-limit"&gt;
        &lt;text class="limit-text"&gt;今日朋友圈分享次数：{{ todayShareCount }}/{{ maxDailyShare }}&lt;/text&gt;
      &lt;/view&gt;

      &lt;view class="share-footer"&gt;
        &lt;view class="cancel-btn" @click="handleClose"&gt;
          &lt;text&gt;取消&lt;/text&gt;
        &lt;/view&gt;
      &lt;/view&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    default: null
  },
  todayShareCount: {
    type: Number,
    default: 0
  },
  maxDailyShare: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['share', 'close'])

const shareOptions = [
  { type: 'wechat', label: '微信好友', icon: '💬', points: 0 },
  { type: 'moments', label: '朋友圈', icon: '⭕', points: 5 }
]

const showShareLimit = computed(() =&gt; {
  return props.task?.type === 'checkin'
})

const shareContent = computed(() =&gt; {
  const task = props.task
  if (!task) {
    return {
      title: '我在百里口才学习',
      desc: '让演说成为孩子自信生长的力量！'
    }
  }

  const typeText = task.type === 'checkin' ? '打卡' : '作业'
  const progress = task.submitCount || 0
  const total = task.totalDays || 0
  const streak = task.streakDays || 0

  let title = `🔥 我在百里口才完成了《${task.title}》`
  if (streak &gt; 1) {
    title += `，连续${streak}天${typeText}！`
  } else if (total &gt; 0) {
    title += `，已完成${progress}/${total}！`
  }

  return {
    title,
    desc: '让演说成为孩子自信生长的力量！'
  }
})

const isOptionDisabled = (option) =&gt; {
  if (option.type === 'moments') {
    return props.todayShareCount &gt;= props.maxDailyShare
  }
  return false
}

const handleShare = (option) =&gt; {
  if (isOptionDisabled(option)) {
    uni.showToast({
      title: '今日朋友圈分享次数已用完',
      icon: 'none'
    })
    return
  }
  emit('share', {
    type: option.type,
    task: props.task,
    points: option.points
  })
}

const handleClose = () =&gt; {
  emit('close')
}
&lt;/script&gt;

&lt;style lang="scss" scoped&gt;
@import '@/styles/variables.scss';

.share-panel-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-bg-mask;
  display: flex;
  align-items: flex-end;
  z-index: 999;
}

.share-panel {
  width: 100%;
  background: $color-bg-card;
  border-radius: $radius-card $radius-card 0 0;
  padding: $spacing-xl;
  padding-bottom: calc($spacing-xl + env(safe-area-inset-bottom));

  .share-header {
    text-align: center;
    margin-bottom: $spacing-xl;

    .share-title {
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }

  .share-preview {
    background: $color-bg-page;
    border-radius: $radius-card;
    padding: $spacing-lg;
    margin-bottom: $spacing-xl;
    display: flex;
    gap: $spacing-md;

    .preview-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: $spacing-sm;

      .preview-title {
        font-size: $font-size-body;
        font-weight: $font-weight-medium;
        color: $color-text-primary;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .preview-desc {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }

    .preview-image {
      width: 120rpx;
      height: 120rpx;
      background: linear-gradient(135deg, $color-primary 0%, #ff8a5b 100%);
      border-radius: $radius-sm;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .image-placeholder {
        font-size: 60rpx;
      }
    }
  }

  .share-options {
    display: flex;
    justify-content: center;
    gap: $spacing-xl;
    margin-bottom: $spacing-md;

    .share-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-md;

      &amp;.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .option-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 44rpx;

        &amp;.wechat {
          background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
        }

        &amp;.moments {
          background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
        }
      }

      .option-label {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }
  }

  .share-limit {
    text-align: center;
    padding: $spacing-md 0;

    .limit-text {
      font-size: $font-size-caption;
      color: $color-text-placeholder;
    }
  }

  .share-footer {
    padding-top: $spacing-lg;
    border-top: 2rpx solid $color-border-light;

    .cancel-btn {
      text-align: center;
      padding: $spacing-md;
      font-size: $font-size-body;
      color: $color-text-secondary;
    }
  }
}
&lt;/style&gt;
