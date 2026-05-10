<template>
  <view
    class="bl-button"
    :class="[
      typeClass,
      sizeClass,
      { 'bl-button--disabled': disabled, 'bl-button--plain': plain, 'bl-button--round': round }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'default', 'danger', 'success', 'warning'].includes(val)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  plain: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const typeClass = computed(() => `bl-button--${props.type}`)
const sizeClass = computed(() => `bl-button--${props.size}`)

const handleClick = (e) => {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: $font-weight-medium;
  transition: all 0.2s;
  outline: none;
  border: none;
  cursor: pointer;
  user-select: none;

  &--primary {
    background: $color-primary;
    color: $color-text-white;

    &.bl-button--plain {
      background: $color-primary-light;
      color: $color-primary;
      border: 1px solid $color-primary;
    }
  }

  &--default {
    background: $color-bg-card;
    color: $color-text-primary;
    border: 1px solid $color-border;

    &.bl-button--plain {
      background: transparent;
      border: 1px solid $color-border;
    }
  }

  &--danger {
    background: $color-danger;
    color: $color-text-white;

    &.bl-button--plain {
      background: $color-danger-light;
      color: $color-danger;
      border: 1px solid $color-danger;
    }
  }

  &--success {
    background: $color-success;
    color: $color-text-white;

    &.bl-button--plain {
      background: $color-success-light;
      color: $color-success;
      border: 1px solid $color-success;
    }
  }

  &--warning {
    background: $color-warning;
    color: $color-text-white;

    &.bl-button--plain {
      background: $color-warning-light;
      color: $color-warning;
      border: 1px solid $color-warning;
    }
  }

  &--small {
    padding: $spacing-xs $spacing-md;
    font-size: $font-size-caption;
    border-radius: $radius-button;
  }

  &--medium {
    padding: $spacing-sm $spacing-xl;
    font-size: $font-size-body;
    border-radius: $radius-button;
  }

  &--large {
    padding: $spacing-md $spacing-xxl;
    font-size: $font-size-h3;
    border-radius: $radius-button;
    width: 100%;
  }

  &--round {
    border-radius: $radius-full;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
