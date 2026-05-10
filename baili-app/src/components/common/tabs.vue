<template>
  <view class="bl-tabs">
    <view class="bl-tabs__header">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="bl-tabs__item"
        :class="{ 'bl-tabs__item--active': currentIndex === index }"
        @click="handleTabClick(index)"
      >
        <text class="bl-tabs__text">{{ tab }}</text>
        <view v-if="currentIndex === index" class="bl-tabs__indicator"></view>
      </view>
    </view>
    <view class="bl-tabs__content">
      <slot></slot>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const currentIndex = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  currentIndex.value = val
})

const handleTabClick = (index) => {
  currentIndex.value = index
  emit('update:modelValue', index)
  emit('change', index)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-tabs {
  &__header {
    display: flex;
    background: $color-bg-card;
    border-bottom: 1px solid $color-border-light;
  }

  &__item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-md 0;
    position: relative;
    cursor: pointer;

    &--active {
      .bl-tabs__text {
        color: $color-primary;
        font-weight: $font-weight-semibold;
      }
    }
  }

  &__text {
    font-size: $font-size-body;
    color: $color-text-secondary;
    transition: all 0.2s;
  }

  &__indicator {
    position: absolute;
    bottom: 0;
    width: 40rpx;
    height: 6rpx;
    background: $color-primary;
    border-radius: 3rpx;
  }

  &__content {
    background: $color-bg-page;
  }
}
</style>
