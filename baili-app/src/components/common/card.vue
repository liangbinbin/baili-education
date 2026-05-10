<template>
  <view class="bl-card" :class="{ 'bl-card--no-shadow': noShadow }">
    <view v-if="$slots.header" class="bl-card__header">
      <slot name="header"></slot>
    </view>
    <view class="bl-card__body">
      <slot></slot>
    </view>
    <view v-if="$slots.footer" class="bl-card__footer">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script setup>
defineProps({
  noShadow: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  box-shadow: $shadow-card;
  overflow: hidden;

  &--no-shadow {
    box-shadow: none;
  }

  &__header {
    padding: $spacing-lg $spacing-xl 0;
  }

  &__body {
    padding: $spacing-xl;
  }

  &__footer {
    padding: 0 $spacing-xl $spacing-lg;
  }
}
</style>
