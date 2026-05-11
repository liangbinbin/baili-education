<template>
  <view class="student-switcher-mask" v-if="visible" @click="close">
    <view class="student-switcher-content" @click.stop>
      <view class="switcher-header">
        <text class="switcher-title">切换账户</text>
        <text class="switcher-close" @click="close">×</text>
      </view>
      
      <view class="account-list">
        <view 
          class="account-item" 
          :class="{ active: currentAccountId === account.id }"
          v-for="account in accounts" 
          :key="account.id"
          @click="selectAccount(account)"
        >
          <image class="account-avatar" :src="account.avatar" mode="aspectFill" />
          <view class="account-info">
            <text class="account-name">{{ account.name }}</text>
            <text class="account-desc">{{ account.desc }}</text>
          </view>
          <view v-if="currentAccountId === account.id" class="account-check">✓</view>
        </view>
      </view>
      
      <view class="add-account" @click="addAccount">
        <text class="add-icon">+</text>
        <text class="add-text">添加新账户</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  accounts: {
    type: Array,
    default: () => []
  },
  currentAccountId: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['close', 'select', 'add'])

const close = () => {
  emit('close')
}

const selectAccount = (account) => {
  emit('select', account)
  close()
}

const addAccount = () => {
  emit('add')
  close()
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.student-switcher-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.student-switcher-content {
  background: $color-bg-card;
  border-radius: 40rpx 40rpx 0 0;
  width: 100%;
  max-height: 80vh;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.switcher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-xl;
  border-bottom: 2rpx solid $color-border-light;

  .switcher-title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  .switcher-close {
    font-size: 48rpx;
    color: $color-text-secondary;
    line-height: 1;
  }
}

.account-list {
  padding: $spacing-lg 0;
}

.account-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg $spacing-xl;
  gap: $spacing-md;

  &.active {
    background: $color-primary-light;
  }

  .account-avatar {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
  }

  .account-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;

    .account-name {
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }

    .account-desc {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }
  }

  .account-check {
    font-size: 36rpx;
    color: $color-primary;
    font-weight: bold;
  }
}

.add-account {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  padding: $spacing-xl;
  border-top: 2rpx solid $color-border-light;

  .add-icon {
    width: 48rpx;
    height: 48rpx;
    border: 2rpx dashed $color-primary;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: $color-primary;
  }

  .add-text {
    font-size: $font-size-body;
    color: $color-primary;
    font-weight: $font-weight-medium;
  }
}
</style>
