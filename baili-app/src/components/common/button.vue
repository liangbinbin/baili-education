<template>
  <view
    class="button"
    :class="[
      typeClass,
      sizeClass,
      { 'button--disabled': disabled, 'button--loading': loading, 'button--block': block }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <view v-if="loading" class="loading-spinner"></view>
    <slot></slot>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'outline', 'text', 'danger', 'success', 'warning'].includes(val)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  block: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const typeClass = computed(() => `button--${props.type}`)
const sizeClass = computed(() => `button--${props.size}`)

const handleClick = (e) => {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-medium;
  transition: all $transition-fast;
  outline: none;
  border: none;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  &--primary {
    background: $color-primary-gradient;
    color: $color-text-white;
    box-shadow: 0 4rpx 12rpx rgba(255, 107, 53, 0.3);
  }

  &--secondary {
    background: $color-bg-card;
    color: $color-text-primary;
    border: 2rpx solid $color-border;
  }

  &--outline {
    background: transparent;
    color: $color-primary;
    border: 2rpx solid $color-primary;
  }

  &--text {
    background: transparent;
    color: $color-primary;
  }

  &--danger {
    background: $color-danger;
    color: $color-text-white;
  }

  &--success {
    background: $color-success;
    color: $color-text-white;
  }

  &--warning {
    background: $color-warning;
    color: $color-text-white;
  }

  &--small {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-caption;
    border-radius: $radius-button;
  }

  &--medium {
    padding: $spacing-sm $spacing-lg;
    font-size: $font-size-body;
    border-radius: $radius-button;
  }

  &--large {
    height: 96rpx;
    padding: 0 $spacing-xl;
    font-size: $font-size-h3;
    border-radius: $radius-button;
  }

  &--block {
    width: 100%;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 32rpx;
    height: 32rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.3);
    border-top-color: $color-text-white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: $spacing-xs;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
