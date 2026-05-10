<template>
  <view class="bl-loading" :class="sizeClass">
    <view class="bl-loading__spinner">
      <view v-for="i in 12" :key="i" class="bl-loading__dot"></view>
    </view>
    <text v-if="text" class="bl-loading__text">{{ text }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  text: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => `bl-loading--${props.size}`)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl;

  &--small {
    .bl-loading__spinner {
      width: 32rpx;
      height: 32rpx;
    }
  }

  &--medium {
    .bl-loading__spinner {
      width: 48rpx;
      height: 48rpx;
    }
  }

  &--large {
    .bl-loading__spinner {
      width: 64rpx;
      height: 64rpx;
    }
  }

  &__spinner {
    position: relative;
    animation: spin 1s linear infinite;

    .bl-loading__dot {
      position: absolute;
      width: 15%;
      height: 40%;
      background: $color-primary;
      border-radius: 10rpx;
      left: 42%;
      top: 30%;
      opacity: 0;

      @for $i from 1 through 12 {
        &:nth-child(#{$i}) {
          transform: rotate(($i - 1) * 30deg) translateY(-140%);
          animation: fade 1.2s linear (($i - 1) * 0.1s) infinite;
        }
      }
    }
  }

  &__text {
    margin-top: $spacing-sm;
    font-size: $font-size-caption;
    color: $color-text-secondary;
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fade {
  0%, 39%, 100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
