<template>
  <view v-if="visible" class="bl-toast" :class="typeClass">
    <view v-if="type === 'loading'" class="bl-toast__loading">
      <view class="bl-toast__spinner">
        <view v-for="i in 12" :key="i" class="bl-toast__dot"></view>
      </view>
    </view>
    <view v-else class="bl-toast__icon">
      <text v-if="type === 'success'">✓</text>
      <text v-else-if="type === 'error'">✕</text>
      <text v-else-if="type === 'warning'">!</text>
    </view>
    <text v-if="message" class="bl-toast__message">{{ message }}</text>
  </view>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text',
    validator: (val) => ['text', 'success', 'error', 'warning', 'loading'].includes(val)
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const emit = defineEmits(['update:visible'])

const typeClass = computed(() => `bl-toast--${props.type}`)

watch(() => props.visible, (val) => {
  if (val && props.type !== 'loading') {
    setTimeout(() => {
      emit('update:visible', false)
    }, props.duration)
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: $spacing-xl $spacing-xxl;
  background: rgba(0, 0, 0, 0.75);
  border-radius: $radius-card;
  animation: fadeIn 0.2s ease;
  min-width: 160rpx;

  &--text {
    padding: $spacing-md $spacing-xl;
  }

  &__icon {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-sm;

    text {
      font-size: 48rpx;
      color: $color-text-white;
      font-weight: bold;
    }
  }

  &__loading {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: $spacing-sm;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__spinner {
    position: relative;
    width: 60rpx;
    height: 60rpx;
    animation: spin 1s linear infinite;

    .bl-toast__dot {
      position: absolute;
      width: 15%;
      height: 40%;
      background: $color-text-white;
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

  &__message {
    font-size: $font-size-body;
    color: $color-text-white;
    text-align: center;
    line-height: 1.5;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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
