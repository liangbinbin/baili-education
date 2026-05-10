<template>
  <view class="class-page">
    <Navbar title="班级" />

    <view class="class-list">
      <view
        class="class-item"
        v-for="item in classList"
        :key="item.id"
        @click="goToDetail(item.id)"
      >
        <image class="class-cover" :src="item.cover" mode="aspectFill" />
        <view class="class-info">
          <text class="class-name">{{ item.name }}</text>
          <view class="class-meta">
            <text class="teacher">👨‍🏫 {{ item.teacher }}</text>
            <text class="students">👥 {{ item.studentCount }}人</text>
          </view>
          <view class="class-schedule">
            <text class="schedule-text">{{ item.schedule }}</text>
          </view>
        </view>
        <view class="arrow">›</view>
      </view>
      <EmptyState v-if="classList.length === 0" description="暂无班级" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const classList = ref([
  {
    id: 1,
    name: '少儿口才启蒙班',
    teacher: '李老师',
    studentCount: 15,
    schedule: '周六 10:00-11:30',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20speech%20class%20room&image_size=square'
  },
  {
    id: 2,
    name: '演讲技巧进阶班',
    teacher: '王老师',
    studentCount: 12,
    schedule: '周日 14:00-15:30',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=public%20speaking%20class%20room&image_size=square'
  }
])

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/class-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.class-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
}

.class-list {
  padding: $spacing-lg;

  .class-item {
    background: $color-bg-card;
    border-radius: $radius-card;
    padding: $spacing-lg;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-lg;
    box-shadow: $shadow-default;

    .class-cover {
      width: 160rpx;
      height: 160rpx;
      border-radius: $radius-card;
      flex-shrink: 0;
    }

    .class-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      min-width: 0;

      .class-name {
        font-size: $font-size-h3;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .class-meta {
        display: flex;
        gap: $spacing-lg;

        .teacher,
        .students {
          font-size: $font-size-caption;
          color: $color-text-secondary;
        }
      }

      .class-schedule {
        .schedule-text {
          font-size: $font-size-caption;
          color: $color-primary;
          background: $color-primary-light;
          padding: $spacing-xs $spacing-sm;
          border-radius: $radius-tag;
          display: inline-block;
        }
      }
    }

    .arrow {
      font-size: 36rpx;
      color: $color-text-placeholder;
      flex-shrink: 0;
    }
  }
}
</style>
