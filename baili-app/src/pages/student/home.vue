<template>
  <view class="home-page">
    <view class="navbar">
      <text class="navbar-title">百里口才|百里演说</text>
    </view>

    <view class="user-card">
      <image class="user-avatar" :src="userStore.userInfo?.avatar || defaultAvatar" mode="aspectFill" />
      <view class="user-detail">
        <text class="user-name">{{ userStore.userInfo?.name || '同学' }}</text>
        <view class="user-meta">
          <text class="user-points">⭐ {{ overview.points }}积分</text>
          <text class="user-checkin">连续打卡 {{ overview.checkinDays }}天</text>
        </view>
      </view>
    </view>

    <view class="stats-grid">
      <view class="stat-item">
        <text class="stat-icon">📝</text>
        <text class="stat-value">{{ overview.pendingHomework }}</text>
        <text class="stat-label">待完成作业</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">✅</text>
        <text class="stat-value">{{ overview.completedHomework }}</text>
        <text class="stat-label">已完成作业</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">🔥</text>
        <text class="stat-value">{{ overview.checkinDays }}</text>
        <text class="stat-label">连续打卡</text>
      </view>
      <view class="stat-item">
        <text class="stat-icon">📅</text>
        <text class="stat-value">{{ overview.totalCheckin }}</text>
        <text class="stat-label">累计打卡</text>
      </view>
    </view>

    <scroll-view class="quick-actions" scroll-x="true" show-scrollbar="false">
      <view class="quick-actions-wrap">
        <view class="quick-action" @click="goToTask">
          <text class="quick-action-icon">🎯</text>
          <text class="quick-action-text">去打卡</text>
        </view>
        <view class="quick-action" @click="goToTask">
          <text class="quick-action-icon">📋</text>
          <text class="quick-action-text">作业列表</text>
        </view>
        <view class="quick-action" @click="goToPoints">
          <text class="quick-action-icon">🏅</text>
          <text class="quick-action-text">积分中心</text>
        </view>
        <view class="quick-action" @click="goToCourse">
          <text class="quick-action-icon">📚</text>
          <text class="quick-action-text">我的课程</text>
        </view>
      </view>
    </scroll-view>

    <view class="section-header">
      <text class="section-title">今日待办</text>
    </view>

    <view class="todo-list">
      <view
        class="todo-item"
        v-for="item in todayTodos"
        :key="item.id"
        @click="goToTaskDetail(item.id)"
      >
        <view class="todo-icon">
          <text>{{ item.type === 'homework' ? '📝' : '🔥' }}</text>
        </view>
        <view class="todo-content">
          <text class="todo-title">{{ item.title }}</text>
          <text class="todo-desc">{{ item.desc }}</text>
        </view>
        <view class="todo-action">
          <text class="todo-btn">去完成 ›</text>
        </view>
      </view>
      <EmptyState v-if="todayTodos.length === 0" description="今日无待办" />
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { getHomeOverview } from '@/api/home'

const userStore = useUserStore()

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20student%20avatar&image_size=square'

const overview = ref({
  points: 850,
  checkinDays: 7,
  pendingHomework: 3,
  completedHomework: 12,
  totalCheckin: 45
})

const todayTodos = ref([
  {
    id: 1,
    title: '《演讲基础》第3周作业',
    type: 'homework',
    desc: '待完成 · 截止明天'
  },
  {
    id: 2,
    title: '《演讲进阶》每日打卡',
    type: 'checkin',
    desc: '进行中 · 已完成5/7天'
  }
])

const loadHomeData = async () => {
  try {
    const data = await getHomeOverview()
    if (data) {
      overview.value = { ...overview.value, ...data }
    }
  } catch (error) {
    console.error('获取首页数据失败', error)
  }
}

onMounted(() => {
  if (userStore.isLoggedIn) {
    userStore.fetchUserInfo()
    loadHomeData()
  }
})

const goToPoints = () => {
  uni.switchTab({ url: '/pages/student/points' })
}

const goToTask = () => {
  uni.switchTab({ url: '/pages/student/task' })
}

const goToTaskDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/task-detail?id=${id}` })
}

const goToCourse = () => {
  uni.navigateTo({ url: '/pages/student/course' })
}

const goToClass = () => {
  uni.navigateTo({ url: '/pages/student/class' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.home-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 40rpx;
}

.navbar {
  background: $color-bg-card;
  padding: 40rpx $spacing-xl $spacing-lg;

  .navbar-title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }
}

.user-card {
  background: $color-primary-gradient;
  margin: $spacing-lg;
  padding: $spacing-xl;
  border-radius: $radius-card;
  display: flex;
  align-items: center;
  gap: $spacing-md;

  .user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
  }

  .user-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .user-name {
      font-size: $font-size-h2;
      font-weight: $font-weight-bold;
      color: $color-text-white;
    }

    .user-meta {
      display: flex;
      gap: $spacing-lg;

      .user-points,
      .user-checkin {
        font-size: $font-size-body;
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-md;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-lg;

  .stat-item {
    background: $color-bg-card;
    border-radius: $radius-card;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;
    box-shadow: $shadow-default;

    .stat-icon {
      font-size: 40rpx;
    }

    .stat-value {
      font-size: $font-size-h1;
      font-weight: $font-weight-bold;
      color: $color-primary;
    }

    .stat-label {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }
  }
}

.quick-actions {
  white-space: nowrap;
  margin-bottom: $spacing-lg;

  .quick-actions-wrap {
    display: inline-flex;
    gap: $spacing-md;
    padding: 0 $spacing-lg;

    .quick-action {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: $spacing-sm;
      background: $color-bg-card;
      padding: $spacing-lg $spacing-xl;
      border-radius: $radius-card;
      box-shadow: $shadow-default;

      .quick-action-icon {
        font-size: 40rpx;
      }

      .quick-action-text {
        font-size: $font-size-body;
        color: $color-text-primary;
        font-weight: $font-weight-medium;
      }
    }
  }
}

.section-header {
  padding: 0 $spacing-xl;
  margin-bottom: $spacing-md;

  .section-title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }
}

.todo-list {
  padding: 0 $spacing-lg;

  .todo-item {
    background: $color-bg-card;
    border-radius: $radius-card;
    padding: $spacing-lg;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    margin-bottom: $spacing-md;
    box-shadow: $shadow-default;

    .todo-icon {
      font-size: 48rpx;
      flex-shrink: 0;
    }

    .todo-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      min-width: 0;

      .todo-title {
        font-size: $font-size-h3;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .todo-desc {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }

    .todo-action {
      flex-shrink: 0;

      .todo-btn {
        font-size: $font-size-body;
        color: $color-primary;
        font-weight: $font-weight-medium;
      }
    }
  }
}
</style>
