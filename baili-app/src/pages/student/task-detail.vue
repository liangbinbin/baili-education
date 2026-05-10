<template>
  <view class="task-detail-page">
    <Navbar :title="task.type === 'homework' ? '作业详情' : '打卡详情'" />

    <view class="content">
      <view class="header-card">
        <view class="task-type" :class="task.type">
          <text v-if="task.type === 'homework'">📝 作业</text>
          <text v-else>📅 打卡</text>
        </view>
        <text class="task-title">{{ task.title }}</text>
        <view class="task-meta">
          <text class="deadline">🕐 截止时间：{{ task.deadline }}</text>
          <text class="points">⭐ 积分：{{ task.points }}</text>
        </view>
      </view>

      <view class="desc-card">
        <text class="card-title">任务要求</text>
        <text class="task-desc">{{ task.description }}</text>
      </view>

      <view v-if="task.attachments && task.attachments.length > 0" class="attachments-card">
        <text class="card-title">参考资料</text>
        <view class="attachment-list">
          <view class="attachment-item" v-for="(item, index) in task.attachments" :key="index">
            <text class="attachment-icon">📄</text>
            <text class="attachment-name">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <view v-if="task.status === 'completed' && task.submission" class="submission-card">
        <text class="card-title">我的提交</text>
        <SubmitRecord :record="task.submission" />
      </view>

      <view v-if="task.status === 'completed' && task.gradedPoints" class="grade-card">
        <text class="card-title">老师评语</text>
        <view class="grade-info">
          <text class="grade-points">获得积分：{{ task.gradedPoints }}/{{ task.points }}</text>
          <text class="grade-comment" v-if="task.comment">{{ task.comment }}</text>
        </view>
      </view>
    </view>

    <view v-if="task.status === 'pending'" class="footer">
      <Button type="primary" size="large" @click="goToSubmit">
        提交任务
      </Button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const taskId = ref('')

const task = ref({
  id: 1,
  title: '《演讲与口才》第3课作业',
  type: 'homework',
  deadline: '2024-01-15 23:59',
  status: 'pending',
  points: 20,
  description: '请录制一段2-3分钟的自我介绍视频，要求：\n1. 声音洪亮，吐字清晰\n2. 站姿端正，面带微笑\n3. 内容流畅，有逻辑性',
  attachments: [
    { name: '课程笔记.pdf' },
    { name: '示范视频.mp4' }
  ]
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    taskId.value = options.id
  }
})

const goToSubmit = () => {
  uni.navigateTo({ url: `/pages/student/task-submit?id=${taskId.value}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.task-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 160rpx;
}

.content {
  padding: $spacing-lg;
}

.header-card,
.desc-card,
.attachments-card,
.submission-card,
.grade-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;

  .card-title {
    display: block;
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $spacing-md;
  }
}

.header-card {
  .task-type {
    display: inline-block;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    margin-bottom: $spacing-md;

    &.homework {
      background: $color-primary-light;
      color: $color-primary;
    }

    &.checkin {
      background: $color-checkin-light;
      color: $color-checkin;
    }
  }

  .task-title {
    display: block;
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-md;
  }

  .task-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .deadline,
    .points {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }
  }
}

.desc-card {
  .task-desc {
    font-size: $font-size-body;
    color: $color-text-secondary;
    line-height: 1.8;
    white-space: pre-wrap;
  }
}

.attachments-card {
  .attachment-list {
    .attachment-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      padding: $spacing-sm 0;

      .attachment-icon {
        font-size: 36rpx;
      }

      .attachment-name {
        font-size: $font-size-body;
        color: $color-text-primary;
      }
    }
  }
}

.grade-card {
  .grade-info {
    .grade-points {
      display: block;
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-primary;
      margin-bottom: $spacing-sm;
    }

    .grade-comment {
      font-size: $font-size-body;
      color: $color-text-secondary;
      line-height: 1.6;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-bg-card;
  padding: $spacing-lg $spacing-xl;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);
}
</style>
