<template>
  <view class="task-records-page">
    <Navbar title="提交记录" />

    <view class="records-list">
      <view class="record-item" v-for="record in records" :key="record.id">
        <view class="record-header">
          <text class="record-title">{{ record.title }}</text>
          <text class="record-time">{{ record.time }}</text>
        </view>
        <SubmitRecord :record="record" />
        <view v-if="record.gradedPoints" class="record-grade">
          <text class="grade-label">老师评价</text>
          <view class="grade-content">
            <text class="grade-points">获得积分：{{ record.gradedPoints }}/{{ record.points }}</text>
            <text class="grade-comment" v-if="record.comment">{{ record.comment }}</text>
          </view>
        </view>
      </view>
      <EmptyState v-if="records.length === 0" description="暂无提交记录" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([
  {
    id: 1,
    title: '自我介绍视频',
    time: '2024-01-08 15:30',
    type: 'video',
    files: [
      { type: 'video', name: '自我介绍.mp4' }
    ],
    content: '这是我的第一次作业，请老师多多指教！',
    points: 25,
    gradedPoints: 23,
    comment: '表现很棒！继续加油！'
  },
  {
    id: 2,
    title: '绕口令打卡',
    time: '2024-01-05 09:20',
    type: 'image',
    files: [
      { type: 'image', url: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=practice%20photo&image_size=square' }
    ],
    content: '今天练习了绕口令，舌头都打结了哈哈',
    points: 10,
    gradedPoints: 10,
    comment: '打卡成功！'
  }
])
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.task-records-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
}

.records-list {
  padding: $spacing-lg;

  .record-item {
    background: $color-bg-card;
    border-radius: $radius-card;
    padding: $spacing-xl;
    margin-bottom: $spacing-lg;

    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-md;

      .record-title {
        font-size: $font-size-h3;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
      }

      .record-time {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }

    .record-grade {
      margin-top: $spacing-lg;
      padding-top: $spacing-lg;
      border-top: 2rpx solid $color-border-light;

      .grade-label {
        display: block;
        font-size: $font-size-body;
        font-weight: $font-weight-medium;
        color: $color-text-primary;
        margin-bottom: $spacing-sm;
      }

      .grade-content {
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
  }
}
</style>
