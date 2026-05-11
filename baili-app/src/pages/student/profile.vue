<template>
  <view class="profile-page">
    <Navbar title="个人中心" />

    <view class="user-card" @click="showSwitcher = true">
      <image class="user-avatar" :src="userInfo.avatar" mode="aspectFill" />
      <view class="user-detail">
        <text class="user-name">{{ userInfo.name }}</text>
        <text class="user-points">⭐ {{ userInfo.points }} 积分</text>
      </view>
      <text class="switch-hint">切换</text>
    </view>

    <view class="menu-section">
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

      <view class="menu-item" @click="showSettings">
        <view class="menu-left">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">设置</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>

      <view class="menu-item" @click="goToHelp">
        <view class="menu-left">
          <text class="menu-icon">📞</text>
          <text class="menu-text">联系我们</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <StudentSwitcher
      :visible="showSwitcher"
      :accounts="accounts"
      :current-account-id="userInfo.id"
      @close="showSwitcher = false"
      @select="handleSelectAccount"
      @add="handleAddAccount"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

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

const handleSelectAccount = (account) => {
  userInfo.value = { ...userInfo.value, ...account }
  uni.showToast({ title: `已切换到 ${account.name}`, icon: 'success' })
}

const handleAddAccount = () => {
  uni.navigateTo({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.profile-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 40rpx;
}

.user-card {
  background: $color-bg-card;
  margin: $spacing-lg;
  padding: $spacing-xl;
  border-radius: $radius-card;
  display: flex;
  align-items: center;
  gap: $spacing-md;
  box-shadow: $shadow-card;

  .user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
  }

  .user-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .user-name {
      font-size: $font-size-h2;
      font-weight: $font-weight-bold;
      color: $color-text-primary;
    }

    .user-points {
      font-size: $font-size-body;
      color: $color-primary;
    }
  }

  .switch-hint {
    font-size: $font-size-body;
    color: $color-text-secondary;
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
}
</style>
