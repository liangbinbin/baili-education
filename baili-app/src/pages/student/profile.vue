<template>
  <view class="profile-page">
    <view class="header">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="info">
          <text class="name">{{ userInfo.name }}</text>
          <text class="phone">{{ userInfo.phone }}</text>
        </view>
      </view>
      <view class="edit-btn" @click="editProfile">
        <text>编辑</text>
      </view>
    </view>

    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ stats.courses }}</text>
        <text class="stat-label">已学课程</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.tasks }}</text>
        <text class="stat-label">完成任务</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.days }}</text>
        <text class="stat-label">学习天数</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="goToRecords">
        <view class="menu-left">
          <text class="menu-icon">📝</text>
          <text class="menu-text">提交记录</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @click="goToClasses">
        <view class="menu-left">
          <text class="menu-icon">👥</text>
          <text class="menu-text">我的班级</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @click="goToHelp">
        <view class="menu-left">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助中心</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="switchAccount">
        <view class="menu-left">
          <text class="menu-icon">🔄</text>
          <text class="menu-text">切换账号</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @click="showSettings">
        <view class="menu-left">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="logout-btn" @click="logout">
      退出登录
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const userInfo = ref({
  name: '小明同学',
  phone: '138****8888',
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar&image_size=square'
})

const stats = ref({
  courses: 6,
  tasks: 32,
  days: 45
})

const editProfile = () => {
  uni.showToast({ title: '编辑资料', icon: 'none' })
}

const goToRecords = () => {
  uni.navigateTo({ url: '/pages/student/task-records' })
}

const goToClasses = () => {
  uni.navigateTo({ url: '/pages/student/class' })
}

const goToHelp = () => {
  uni.showToast({ title: '帮助中心', icon: 'none' })
}

const switchAccount = () => {
  uni.navigateTo({ url: '/pages/login/switch-account' })
}

const showSettings = () => {
  uni.showToast({ title: '设置', icon: 'none' })
}

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await userStore.doLogout()
          uni.reLaunch({ url: '/pages/login/index' })
        } catch (error) {
          console.error('退出失败', error)
        }
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.profile-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 40rpx;
}

.header {
  background: linear-gradient(135deg, $color-primary 0%, #FF8A5B 100%);
  padding: 100rpx $spacing-xl $spacing-xl;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      .name {
        font-size: $font-size-h2;
        font-weight: $font-weight-bold;
        color: $color-text-white;
      }

      .phone {
        font-size: $font-size-body;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }

  .edit-btn {
    padding: $spacing-xs $spacing-md;
    background: rgba(255, 255, 255, 0.2);
    border-radius: $radius-full;
    font-size: $font-size-body;
    color: $color-text-white;
  }
}

.stats-card {
  margin: -40rpx $spacing-lg $spacing-lg;
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: $shadow-card;

  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-xs;

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

  .stat-divider {
    width: 2rpx;
    height: 80rpx;
    background: $color-border-light;
  }
}

.menu-section {
  background: $color-bg-card;
  margin: 0 $spacing-lg $spacing-lg;
  border-radius: $radius-card;
  overflow: hidden;

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-lg $spacing-xl;

    &:not(:last-child) {
      border-bottom: 2rpx solid $color-border-light;
    }

    .menu-left {
      display: flex;
      align-items: center;
      gap: $spacing-md;

      .menu-icon {
        font-size: 36rpx;
      }

      .menu-text {
        font-size: $font-size-body;
        color: $color-text-primary;
      }
    }

    .menu-arrow {
      font-size: 36rpx;
      color: $color-text-placeholder;
    }
  }
}

.logout-btn {
  margin: $spacing-xl $spacing-lg;
  padding: $spacing-lg;
  background: $color-bg-card;
  border-radius: $radius-card;
  text-align: center;
  font-size: $font-size-body;
  color: $color-danger;
  font-weight: $font-weight-medium;
}
</style>
