<template>
  <view class="bl-submit-record">
    <view class="bl-submit-record__avatar">
      <image :src="avatar" mode="aspectFill" class="bl-submit-record__img" />
    </view>
    <view class="bl-submit-record__content">
      <view class="bl-submit-record__header">
        <text class="bl-submit-record__name">{{ name }}</text>
        <text class="bl-submit-record__time">{{ time }}</text>
      </view>
      <view v-if="content" class="bl-submit-record__text">{{ content }}</view>
      <view v-if="images && images.length > 0" class="bl-submit-record__images">
        <image
          v-for="(img, index) in images"
          :key="index"
          :src="img"
          class="bl-submit-record__image"
          mode="aspectFill"
        />
      </view>
      <view v-if="audio" class="bl-submit-record__audio">
        <view class="bl-submit-record__audio-wave">
          <view v-for="i in 5" :key="i" class="bl-submit-record__audio-bar"></view>
        </view>
        <text class="bl-submit-record__audio-duration">{{ audioDuration }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  avatar: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  images: {
    type: Array,
    default: () => []
  },
  audio: {
    type: String,
    default: ''
  },
  audioDuration: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-submit-record {
  display: flex;
  padding: $spacing-xl 0;
  border-bottom: 1px solid $color-border-light;

  &:last-child {
    border-bottom: none;
  }

  &__avatar {
    flex-shrink: 0;
    margin-right: $spacing-md;
  }

  &__img {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-xs;
  }

  &__name {
    font-size: $font-size-body;
    font-weight: $font-weight-medium;
    color: $color-text-primary;
  }

  &__time {
    font-size: $font-size-caption;
    color: $color-text-placeholder;
  }

  &__text {
    font-size: $font-size-body;
    color: $color-text-secondary;
    line-height: 1.6;
    margin-bottom: $spacing-sm;
  }

  &__images {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;
    margin-bottom: $spacing-sm;
  }

  &__image {
    width: 160rpx;
    height: 160rpx;
    border-radius: $radius-sm;
  }

  &__audio {
    display: flex;
    align-items: center;
    background: $color-primary-light;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-sm;
    width: fit-content;
  }

  &__audio-wave {
    display: flex;
    align-items: flex-end;
    gap: 4rpx;
    margin-right: $spacing-sm;
  }

  &__audio-bar {
    width: 6rpx;
    background: $color-primary;
    border-radius: 3rpx;

    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        height: 20rpx + ($i - 1) * 10rpx;
        animation: audioWave 0.8s ease-in-out infinite;
        animation-delay: ($i - 1) * 0.15s;
      }
    }
  }

  &__audio-duration {
    font-size: $font-size-caption;
    color: $color-primary;
  }
}

@keyframes audioWave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}
</style>
