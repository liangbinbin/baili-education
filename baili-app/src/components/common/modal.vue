<template>
  <view v-if="visible" class="bl-modal" @click="handleMaskClick">
    <view class="bl-modal__content" @click.stop>
      <view v-if="$slots.header || title" class="bl-modal__header">
        <slot name="header">
          <text class="bl-modal__title">{{ title }}</text>
        </slot>
      </view>
      <view class="bl-modal__body">
        <slot></slot>
      </view>
      <view v-if="$slots.footer || showFooter" class="bl-modal__footer">
        <slot name="footer">
          <button v-if="showCancel" class="bl-modal__btn bl-modal__btn--cancel" @click="handleCancel">
            {{ cancelText }}
          </button>
          <button class="bl-modal__btn bl-modal__btn--confirm" @click="handleConfirm">
            {{ confirmText }}
          </button>
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  closeOnClickMask: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:visible', 'cancel', 'confirm'])

const handleMaskClick = () => {
  if (props.closeOnClickMask) {
    emit('update:visible', false)
    emit('cancel')
  }
}

const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $color-bg-mask;
  animation: fadeIn 0.2s ease;

  &__content {
    width: 80%;
    max-width: 600rpx;
    background: $color-bg-card;
    border-radius: $radius-card;
    overflow: hidden;
    animation: scaleIn 0.2s ease;
  }

  &__header {
    padding: $spacing-xl $spacing-xl $spacing-md;
    text-align: center;
  }

  &__title {
    font-size: $font-size-h2;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__body {
    padding: 0 $spacing-xl $spacing-xl;
    max-height: 60vh;
    overflow-y: auto;
  }

  &__footer {
    display: flex;
    border-top: 1px solid $color-border;
  }

  &__btn {
    flex: 1;
    padding: $spacing-lg;
    font-size: $font-size-body;
    border: none;
    background: transparent;
    cursor: pointer;

    &--cancel {
      color: $color-text-secondary;
      border-right: 1px solid $color-border;
    }

    &--confirm {
      color: $color-primary;
      font-weight: $font-weight-medium;
    }
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

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
