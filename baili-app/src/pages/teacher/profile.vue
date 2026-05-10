<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()

const menuList = [
  { icon: '⚙️', title: '个人信息', path: '' },
  { icon: '🔐', title: '修改密码', path: '' },
  { icon: '❓', title: '帮助中心', path: '' },
  { icon: 'ℹ️', title: '关于我们', path: '' }
]

const logout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: async (res) => {
      if (res.confirm) {
        await userStore.doLogout()
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }
    }
  })
}

onMounted(async () => {
  await userStore.fetchUserInfo()
})
</script>

<template>
  <view class="teacher-profile">
    <view class="header">
      <view class="user-info">
        <view class="avatar">
          <text>{{ userStore.userInfo?.name?.charAt(0) || '教' }}</text>
        </view>
        <view class="info">
          <text class="name">{{ userStore.userInfo?.name || '教师' }}</text>
          <text class="phone">{{ userStore.userInfo?.phone || '' }}</text>
        </view>
      </view>
    </view>
    
    <view class="content">
      <view class="menu-section card">
        <view 
          v-for="(menu, index) in menuList" 
          :key="index"
          class="menu-item"
        >
          <view class="menu-left">
            <text class="menu-icon">{{ menu.icon }}</text>
            <text class="menu-title">{{ menu.title }}</text>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
      
      <view class="logout-section">
        <Button type="danger" block @tap="logout">退出登录</Button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.teacher-profile {
  min-height: 100vh;
  background: $color-bg-page;
}

.header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  padding: 100rpx $spacing-lg $spacing-xl;
  color: $color-text-white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
}

.info {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.name {
  font-size: $font-size-h2;
  font-weight: $font-weight-semibold;
}

.phone {
  font-size: $font-size-body;
  opacity: 0.9;
}

.content {
  padding: $spacing-lg;
}

.menu-section {
  padding: 0;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  border-bottom: 1px solid $color-border-light;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.menu-icon {
  font-size: 36rpx;
}

.menu-title {
  font-size: $font-size-body;
  color: $color-text-primary;
}

.menu-arrow {
  font-size: $font-size-h2;
  color: $color-text-placeholder;
}

.logout-section {
  margin-top: $spacing-xl;
}
</style>
