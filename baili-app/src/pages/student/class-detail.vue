<template>
  <view class="class-detail-page">
    <Navbar :title="classInfo.name" />

    <view class="cover-section">
      <image class="cover" :src="classInfo.cover" mode="aspectFill" />
    </view>

    <view class="content">
      <view class="info-card">
        <view class="info-row">
          <text class="info-label">👨‍🏫 主讲老师</text>
          <text class="info-value">{{ classInfo.teacher }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">🕐 上课时间</text>
          <text class="info-value">{{ classInfo.schedule }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">📍 上课地点</text>
          <text class="info-value">{{ classInfo.location }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">👥 班级人数</text>
          <text class="info-value">{{ classInfo.studentCount }}人</text>
        </view>
      </view>

      <Tabs :tabs="tabs" v-model:activeTab="activeTab" />

      <view class="tab-content">
        <view v-if="activeTab === 'schedule'" class="schedule-section">
          <CheckinCalendar />
        </view>

        <view v-if="activeTab === 'members'" class="members-section">
          <view class="member-item" v-for="member in members" :key="member.id">
            <image class="member-avatar" :src="member.avatar" mode="aspectFill" />
            <view class="member-info">
              <text class="member-name">{{ member.name }}</text>
              <text class="member-role" v-if="member.isLeader">班长</text>
            </view>
          </view>
        </view>

        <view v-if="activeTab === 'notices'" class="notices-section">
          <view class="notice-item" v-for="notice in notices" :key="notice.id">
            <view class="notice-header">
              <text class="notice-title">{{ notice.title }}</text>
              <text class="notice-time">{{ notice.time }}</text>
            </view>
            <text class="notice-content">{{ notice.content }}</text>
          </view>
          <EmptyState v-if="notices.length === 0" description="暂无通知" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const classId = ref('')
const activeTab = ref('schedule')

const tabs = [
  { label: '课程表', value: 'schedule' },
  { label: '同学', value: 'members' },
  { label: '通知', value: 'notices' }
]

const classInfo = ref({
  id: 1,
  name: '少儿口才启蒙班',
  teacher: '李老师',
  schedule: '周六 10:00-11:30',
  location: '校区A 302教室',
  studentCount: 15,
  cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20speech%20class%20room&image_size=square'
})

const members = ref([
  {
    id: 1,
    name: '小明',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar&image_size=square',
    isLeader: true
  },
  {
    id: 2,
    name: '小红',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20girl%20avatar&image_size=square',
    isLeader: false
  },
  {
    id: 3,
    name: '小华',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20child%20avatar&image_size=square',
    isLeader: false
  }
])

const notices = ref([
  {
    id: 1,
    title: '下节课内容预告',
    time: '2024-01-10',
    content: '下节课我们将学习故事讲述技巧，请大家提前准备一个小故事。'
  }
])

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    classId.value = options.id
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.class-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
}

.cover-section {
  .cover {
    width: 100%;
    height: 320rpx;
  }
}

.content {
  padding: $spacing-lg;
  margin-top: -40rpx;
  position: relative;
  background: $color-bg-page;
  border-radius: 40rpx 40rpx 0 0;
}

.info-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-sm 0;

    &:not(:last-child) {
      border-bottom: 2rpx solid $color-border-light;
    }

    .info-label {
      font-size: $font-size-body;
      color: $color-text-secondary;
    }

    .info-value {
      font-size: $font-size-body;
      color: $color-text-primary;
      font-weight: $font-weight-medium;
    }
  }
}

.tab-content {
  padding-top: $spacing-lg;

  .members-section {
    .member-item {
      background: $color-bg-card;
      border-radius: $radius-card;
      padding: $spacing-lg;
      display: flex;
      align-items: center;
      gap: $spacing-md;
      margin-bottom: $spacing-md;

      .member-avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }

      .member-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: $spacing-sm;

        .member-name {
          font-size: $font-size-body;
          color: $color-text-primary;
        }

        .member-role {
          font-size: $font-size-caption;
          color: $color-primary;
          background: $color-primary-light;
          padding: $spacing-xs $spacing-sm;
          border-radius: $radius-tag;
        }
      }
    }
  }

  .notices-section {
    .notice-item {
      background: $color-bg-card;
      border-radius: $radius-card;
      padding: $spacing-xl;
      margin-bottom: $spacing-md;

      .notice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-md;

        .notice-title {
          font-size: $font-size-h3;
          font-weight: $font-weight-semibold;
          color: $color-text-primary;
        }

        .notice-time {
          font-size: $font-size-caption;
          color: $color-text-secondary;
        }
      }

      .notice-content {
        font-size: $font-size-body;
        color: $color-text-secondary;
        line-height: 1.6;
      }
    }
  }
}
</style>
