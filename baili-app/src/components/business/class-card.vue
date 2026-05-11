<template>
  <view class="class-card" @click="handleClick">
    <view class="class-card__header">
      <text class="class-card__icon">👥</text>
      <text class="class-card__title">{{ title }}</text>
    </view>
    <view class="class-card__info">
      <view class="class-card__info-item">
        <text class="class-card__label">任课老师：</text>
        <text class="class-card__value">{{ teacher }}</text>
      </view>
      <view class="class-card__info-item">
        <text class="class-card__label">班级人数：</text>
        <text class="class-card__value">{{ studentCount }}人</text>
      </view>
      <view class="class-card__info-item">
        <text class="class-card__label">上课时间：</text>
        <text class="class-card__value">{{ schedule }}</text>
      </view>
    </view>
    <view class="class-card__status">
      <text :class="['class-card__status-text', statusClass]">{{ statusText }}</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  teacher: {
    type: String,
    default: ''
  },
  studentCount: {
    type: Number,
    default: 0
  },
  schedule: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'ongoing' // ongoing, finished
  }
})

const emit = defineEmits(['click'])

const statusClass = computed(() => {
  const map = {
    ongoing: 'ongoing',
    finished: 'finished'
  }
  return map[props.status] || 'ongoing'
})

const statusText = computed(() => {
  const map = {
    ongoing: '进行中',
    finished: '已结课'
  }
  return map[props.status] || '进行中'
})

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.class-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-lg;
  box-shadow: $shadow-card;

  &__header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    &-icon {
      font-size: 36rpx;
    }

    &-title {
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }

  &__icon {
    font-size: 36rpx;
  }

  &__title {
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    &-item {
      display: flex;
      align-items: center;
    }
  }

  &__label {
    font-size: $font-size-body;
    color: $color-text-secondary;
  }

  &__value {
    font-size: $font-size-body;
    color: $color-text-primary;
    font-weight: $font-weight-medium;
  }

  &__status {
    &-text {
      display: inline-block;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-tag;
      font-size: $font-size-caption;
      font-weight: $font-weight-medium;

      &.ongoing {
        background: $color-success-light;
        color: $color-success;
      }

      &.finished {
        background: $color-border-light;
        color: $color-text-placeholder;
      }
    }
  }
}
</style>
