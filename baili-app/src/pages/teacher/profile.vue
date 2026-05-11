<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const stats = ref({
  totalTasks: 24,
  totalStudents: 86,
  totalPoints: 12500
})

const menuItems = [
  {
    icon: '👤',
    title: '个人信息',
    desc: '查看和编辑个人资料',
    path: ''
  },
  {
    icon: '📚',
    title: '我的课程',
    desc: '查看教授的课程列表',
    path: '/pages/teacher/course'
  },
  {
    icon: '👥',
    title: '我的班级',
    desc: '管理班级学员',
    path: '/pages/teacher/class'
  },
  {
    icon: '🔄',
    title: '切换角色',
    desc: '切换到学员端',
    action: 'switchRole'
  },
  {
    icon: '⚙️',
    title: '设置',
    desc: '应用设置',
    path: ''
  },
  {
    icon: '❓',
    title: '帮助与反馈',
    desc: '常见问题',
    path: ''
  }
]

const handleMenuItemClick = (item) => {
  if (item.action === 'switchRole') {
    uni.navigateTo({
      url: '/pages/role-switch/index'
    })
  } else if (item.path) {
    uni.navigateTo({
      url: item.path
    })
  } else {
    uni.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }
}

const logout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.doLogout()
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
  <view class="profile">
    <view class="header">
      <view class="user-info">
        <view class="avatar">
          <text>{{ userStore.userInfo?.name?.charAt(0) || '教' }}</text>
        </view>
        <view class="info">
          <text class="name">{{ userStore.userInfo?.name || '李老师' }}</text>
          <text class="role-label">教师</text>
          <text class="phone">{{ userStore.userInfo?.phone || '138****8888' }}</text>
        </view>
      </view>
    </view>
    
    <view class="stats-card card">
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalTasks }}</text>
        <text class="stat-label">发布任务</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalStudents }}</text>
        <text class="stat-label">学员数</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalPoints }}</text>
        <text class="stat-label">积分发放</text>
      </view>
    </view>
    
    <view class="menu-list">
      <view 
        v-for="(item, index) in menuItems" 
        :key="index" 
        class="menu-item card"
        @tap="handleMenuItemClick(item)"
      >
        <view class="menu-icon">
          <text>{{ item.icon }}</text>
        </view>
        <view class="menu-content">
          <text class="menu-title">{{ item.title }}</text>
          <text class="menu-desc">{{ item.desc }}</text>
        </view>
        <view class="menu-arrow">›</view>
      </view>
    </view>
    
    <view class="footer">
      <Button class="logout-btn" @tap="logout">退出登录</Button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.profile {
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
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.name {
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
}

.role-label {
  font-size: $font-size-body-sm;
  opacity: 0.9;
}

.phone {
  font-size: $font-size-body-sm;
  opacity: 0.8;
}

.stats-card {
  margin: -40rpx $spacing-lg 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: $spacing-xl $spacing-lg;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
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

.stat-divider {
  width: 1px;
  height: 60rpx;
  background: $color-border;
}

.menu-list {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
}

.menu-icon {
  width: 80rpx;
  height: 80rpx;
  background: $color-primary-light;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  flex-shrink: 0;
}

.menu-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.menu-title {
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.menu-desc {
  font-size: $font-size-caption;
  color: $color-text-secondary;
}

.menu-arrow {
  font-size: 36rpx;
  color: $color-text-placeholder;
}

.footer {
  padding: $spacing-lg;
  padding-top: 0;
}

.logout-btn {
  background: $color-danger-light;
  color: $color-danger;
  border: none;
}
</style>
