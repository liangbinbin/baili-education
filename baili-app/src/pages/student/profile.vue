<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const showSwitcher = ref(false)

const userInfo = ref({
  id: 1,
  name: '小明同学',
  points: 850,
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar&image_size=square'
})

const accounts = ref([
  {
    id: 1,
    name: '小明同学',
    desc: '当前账户',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar&image_size=square'
  },
  {
    id: 2,
    name: '小红同学',
    desc: '妹妹',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20girl%20avatar&image_size=square'
  }
])

const editProfile = () => {
  uni.showToast({ title: '编辑资料', icon: 'none' })
}

const goToCourses = () => {
  uni.navigateTo({ url: '/pages/student/course' })
}

const goToRanking = () => {
  uni.navigateTo({ url: '/pages/student/ranking' })
}

const showSettings = () => {
  uni.showToast({ title: '设置', icon: 'none' })
}

const goToHelp = () => {
  uni.showToast({ title: '联系我们', icon: 'none' })
}

const switchRole = () => {
  uni.navigateTo({ url: '/pages/role-switch/index' })
}

const handleSelectAccount = (account) => {
  userInfo.value = { ...userInfo.value, ...account }
  uni.showToast({ title: `已切换到 ${account.name}`, icon: 'success' })
}

const handleAddAccount = () => {
  uni.navigateTo({ url: '/pages/login/index' })
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
  <view class="profile-page">
    <view class="header">
      <view class="user-card">
        <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="user-detail">
          <text class="user-name">{{ userStore.userInfo?.name || userInfo.name }}</text>
          <text class="user-role">学员</text>
        </view>
      </view>
    </view>
    
    <view class="stats-card card">
      <view class="stat-item">
        <text class="stat-value">{{ userInfo.points }}</text>
        <text class="stat-label">总积分</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">28</text>
        <text class="stat-label">完成任务</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">15</text>
        <text class="stat-label">上课天数</text>
      </view>
    </view>

    <view class="menu-section card">
      <view class="menu-item" @click="editProfile">
        <view class="menu-left">
          <text class="menu-icon">✏️</text>
          <text class="menu-text">编辑资料</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @click="goToCourses">
        <view class="menu-left">
          <text class="menu-icon">📚</text>
          <text class="menu-text">我的课程</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @click="goToRanking">
        <view class="menu-left">
          <text class="menu-icon">🏆</text>
          <text class="menu-text">排行榜</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @click="switchRole">
        <view class="menu-left">
          <text class="menu-icon">🔄</text>
          <text class="menu-text">切换角色</text>
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

      <view class="menu-item" @click="goToHelp">
        <view class="menu-left">
          <text class="menu-icon">❓</text>
          <text class="menu-text">帮助与反馈</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>
    
    <view class="footer">
      <Button class="logout-btn" @tap="logout">退出登录</Button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.profile-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.header {
  background: linear-gradient(135deg, $color-primary 0%, $color-primary-dark 100%);
  padding: 100rpx $spacing-lg $spacing-xl;
}

.user-card {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.user-name {
  font-size: $font-size-h2;
  font-weight: $font-weight-bold;
  color: $color-text-white;
}

.user-role {
  font-size: $font-size-body-sm;
  color: rgba(255, 255, 255, 0.9);
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

.menu-section {
  margin: $spacing-lg;
  overflow: hidden;
}

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
    gap: $spacing-sm;

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
