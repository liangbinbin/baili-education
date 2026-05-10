<template>
  <view class="bl-navbar">
    <view class="bl-navbar__left" @click="handleBack">
      <slot name="left">
        <view v-if="showBack" class="bl-navbar__back">
          <text class="bl-navbar__back-icon">‹</text>
        </view>
      </slot>
    </view>
    <view class="bl-navbar__center">
      <slot name="center">
        <text class="bl-navbar__title">{{ title }}</text>
      </slot>
    </view>
    <view class="bl-navbar__right" @click="handleRight">
      <slot name="right">
        <text v-if="rightText" class="bl-navbar__right-text">{{ rightText }}</text>
      </slot>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showBack: {
    type: Boolean,
    default: true
  },
  rightText: {
    type: String,
    default: ''
  },
  fixed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['back', 'right-click'])

const handleBack = () => {
  emit('back')
}

const handleRight = () => {
  emit('right-click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
  padding: 0 $spacing-lg;
  background: $color-bg-card;
  position: relative;

  &__left,
  &__right {
    display: flex;
    align-items: center;
    width: 120rpx;
  }

  &__right {
    justify-content: flex-end;
  }

  &__back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__back-icon {
    font-size: 48rpx;
    color: $color-text-primary;
    font-weight: 300;
  }

  &__center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: $font-size-h2;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__right-text {
    font-size: $font-size-body;
    color: $color-primary;
  }
}
</style>
