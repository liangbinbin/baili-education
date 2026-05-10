<template>
  <view class="bl-empty-state">
    <image v-if="image" :src="image" class="bl-empty-state__image" mode="aspectFit" />
    <text v-if="title" class="bl-empty-state__title">{{ title }}</text>
    <text v-if="description" class="bl-empty-state__description">{{ description }}</text>
    <slot></slot>
  </view>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '暂无数据'
  },
  description: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xxl * 2 $spacing-xl;
  text-align: center;

  &__image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: $spacing-lg;
  }

  &__title {
    font-size: $font-size-body;
    color: $color-text-secondary;
    margin-bottom: $spacing-xs;
  }

  &__description {
    font-size: $font-size-caption;
    color: $color-text-placeholder;
  }
}
</style>
