&lt;template&gt;
  &lt;view class="submit-record"&gt;
    &lt;view class="record-header"&gt;
      &lt;view class="record-date"&gt;
        &lt;text class="date-text"&gt;{{ formatDate(record.date) }}&lt;/text&gt;
        &lt;text v-if="record.dayIndex" class="time-text"&gt;第{{ record.dayIndex }}天&lt;/text&gt;
      &lt;/view&gt;
      &lt;view class="record-status" :class="record.isCompleted ? 'completed' : 'pending'"&gt;
        &lt;text&gt;{{ getStatusText() }}&lt;/text&gt;
      &lt;/view&gt;
      &lt;text v-if="record.pointsEarned" class="record-points"&gt;+{{ record.pointsEarned }}积分&lt;/text&gt;
    &lt;/view&gt;

    &lt;view v-if="record.files &amp;&amp; record.files.length &gt; 0" class="record-files"&gt;
      &lt;view v-for="(file, index) in record.files" :key="index" class="file-item"&gt;
        &lt;text class="file-icon"&gt;{{ getFileIcon(file.type) }}&lt;/text&gt;
        &lt;text class="file-name"&gt;{{ file.name || getFileName(file) }}&lt;/text&gt;
      &lt;/view&gt;
    &lt;/view&gt;

    &lt;view class="share-status" v-if="record.isSharedToChat || record.isSharedToMoments"&gt;
      &lt;text v-if="record.isSharedToChat" class="share-tag chat"&gt;已分享好友&lt;/text&gt;
      &lt;text v-if="record.isSharedToMoments" class="share-tag moments"&gt;已分享朋友圈&lt;/text&gt;
    &lt;/view&gt;

    &lt;view v-if="record.grade || record.comment || record.bonusPoints" class="record-grade"&gt;
      &lt;view class="grade-info"&gt;
        &lt;text class="grade-label"&gt;老师评价&lt;/text&gt;
        &lt;text v-if="record.grade" class="grade-score"&gt;等级：{{ record.grade }}&lt;/text&gt;
        &lt;text v-if="record.bonusPoints" class="grade-points"&gt;额外积分：+{{ record.bonusPoints }}&lt;/text&gt;
      &lt;/view&gt;
      &lt;text v-if="record.comment" class="grade-comment"&gt;{{ record.comment }}&lt;/text&gt;
    &lt;/view&gt;
  &lt;/view&gt;
&lt;/template&gt;

&lt;script setup&gt;
const props = defineProps({
  record: {
    type: Object,
    required: true
  }
})

const formatDate = (dateStr) =&gt; {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}.${day}`
}

const getStatusText = () =&gt; {
  return props.record.isCompleted ? '已完成' : '待完成'
}

const getFileIcon = (type) =&gt; {
  if (type?.includes('video') || type === 'video') return '🎬'
  if (type?.includes('audio') || type === 'audio') return '🎵'
  if (type?.includes('image') || type === 'image') return '🖼️'
  return '📄'
}

const getFileName = (file) =&gt; {
  if (file.name) return file.name
  if (file.url) {
    const parts = file.url.split('/')
    return parts[parts.length - 1] || '文件'
  }
  return '文件'
}
&lt;/script&gt;

&lt;style lang="scss" scoped&gt;
@import '@/styles/variables.scss';

.submit-record {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-md;

  .record-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-md;
    flex-wrap: wrap;
    gap: $spacing-sm;

    .record-date {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .date-text {
        font-size: $font-size-h3;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
      }

      .time-text {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }

    .record-status {
      display: inline-flex;
      align-items: center;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-tag;
      font-size: $font-size-caption;
      font-weight: $font-weight-medium;

      &amp;.completed {
        background: $color-success-light;
        color: $color-success;
      }

      &amp;.pending {
        background: $color-warning-light;
        color: $color-warning;
      }
    }

    .record-points {
      font-size: $font-size-body;
      font-weight: $font-weight-semibold;
      color: $color-primary;
    }
  }

  .record-files {
    margin-bottom: $spacing-md;

    .file-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm 0;

      .file-icon {
        font-size: 36rpx;
      }

      .file-name {
        font-size: $font-size-body;
        color: $color-text-primary;
      }
    }
  }

  .share-status {
    display: flex;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    .share-tag {
      display: inline-flex;
      align-items: center;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-tag;
      font-size: 24rpx;
      font-weight: $font-weight-medium;

      &amp;.chat {
        background: $color-info-light;
        color: $color-info;
      }

      &amp;.moments {
        background: $color-primary-light;
        color: $color-primary;
      }
    }
  }

  .record-grade {
    padding-top: $spacing-md;
    border-top: 2rpx solid $color-border-light;

    .grade-info {
      margin-bottom: $spacing-sm;
      display: flex;
      gap: $spacing-md;

      .grade-label {
        font-size: $font-size-body;
        font-weight: $font-weight-medium;
        color: $color-text-primary;
      }

      .grade-score {
        font-size: $font-size-body;
        color: $color-primary;
      }

      .grade-points {
        font-size: $font-size-body;
        color: $color-primary;
      }
    }

    .grade-comment {
      font-size: $font-size-body;
      color: $color-text-secondary;
      line-height: 1.6;
    }
  }
}
&lt;/style&gt;
