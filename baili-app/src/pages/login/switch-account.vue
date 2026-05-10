<template>
  <view class="switch-account-page">
    <Navbar title="切换账号" />

    <view class="account-list">
      <view class="section-title">已登录账号</view>
      
      <view
        class="account-item"
        v-for="(account, index) in accountList"
        :key="index"
        @click="handleSwitchAccount(account)"
      >
        <image class="avatar" :src="account.avatar" mode="aspectFill" />
        <view class="account-info">
          <text class="name">{{ account.name }}</text>
          <text class="phone">{{ account.phone }}</text>
        </view>
        <view v-if="account.isCurrent" class="current-tag">当前</view>
        <view v-else class="arrow">›</view>
      </view>

      <view class="add-account" @click="handleAddAccount">
        <view class="add-icon">+</view>
        <text class="add-text">添加其他账号</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const accountList = ref([
  {
    id: 1,
    name: '小明同学',
    phone: '138****8888',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar&image_size=square',
    isCurrent: true
  },
  {
    id: 2,
    name: '小红同学',
    phone: '139****9999',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20girl%20avatar&image_size=square',
    isCurrent: false
  }
])

const handleSwitchAccount = (account) => {
  if (account.isCurrent) return
  
  uni.showModal({
    title: '切换账号',
    content: `确定切换到 ${account.name} 的账号吗？`,
    success: (res) => {
      if (res.confirm) {
        accountList.value.forEach(item => {
          item.isCurrent = item.id === account.id
        })
        uni.showToast({ title: '切换成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/student/home' })
        }, 1500)
      }
    }
  })
}

const handleAddAccount = () => {
  uni.navigateTo({ url: '/pages/login/index' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.switch-account-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.account-list {
  padding: $spacing-lg;
  padding-top: 120rpx;

  .section-title {
    font-size: $font-size-body;
    color: $color-text-secondary;
    margin-bottom: $spacing-md;
    padding-left: $spacing-sm;
  }

  .account-item {
    background: $color-bg-card;
    border-radius: $radius-card;
    padding: $spacing-lg;
    display: flex;
    align-items: center;
    margin-bottom: $spacing-md;
    position: relative;

    .avatar {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      margin-right: $spacing-md;
    }

    .account-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      .name {
        font-size: $font-size-h3;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
      }

      .phone {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }

    .current-tag {
      padding: $spacing-xs $spacing-sm;
      background: $color-primary-light;
      color: $color-primary;
      font-size: $font-size-caption;
      border-radius: $radius-tag;
    }

    .arrow {
      font-size: 48rpx;
      color: $color-text-placeholder;
      font-weight: 300;
    }
  }

  .add-account {
    background: $color-bg-card;
    border-radius: $radius-card;
    padding: $spacing-lg;
    display: flex;
    align-items: center;
    gap: $spacing-md;
    border: 2rpx dashed $color-border;

    .add-icon {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      background: $color-border-light;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;
      color: $color-text-placeholder;
    }

    .add-text {
      font-size: $font-size-body;
      color: $color-text-secondary;
    }
  }
}
</style>
