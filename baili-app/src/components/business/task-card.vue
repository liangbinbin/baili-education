<template>
  <view class="bl-task-card" @click="handleClick">
    <view class="bl-task-card__header">
      <view class="bl-task-card__type" :class="`bl-task-card__type--${type}`">
        <text v-if="type === 'homework'">作业</text>
        <text v-else>打卡</text>
      </view>
      <view v-if="status === 'expired'" class="bl-task-card__expired">已过期</view>
    </view>
    <view class="bl-task-card__body">
      <text class="bl-task-card__title">{{ title }}</text>
      <text v-if="description" class="bl-task-card__desc">{{ description }}</text>
    </view>
    <view class="bl-task-card__footer">
      <view class="bl-task-card__time">
        <text>截止时间：{{ deadline }}</text>
      </view>
      <view class="bl-task-card__status" :class="`bl-task-card__status--${status}`">
        <text v-if="status === 'pending'">待完成</text>
        <text v-else-if="status === 'submitted'">已提交</text>
        <text v-else-if="status === 'expired'">已过期</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'homework',
    validator: (val) => ['homework', 'checkin'].includes(val)
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  deadline: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'pending',
    validator: (val) => ['pending', 'submitted', 'expired'].includes(val)
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-task-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;
  box-shadow: $shadow-default;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-md;
  }

  &__type {
    display: inline-flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;

    &--homework {
      background: $color-primary-light;
      color: $color-primary;
    }

    &--checkin {
      background: $color-checkin-light;
      color: $color-checkin;
    }
  }

  &__expired {
    font-size: $font-size-caption;
    color: $color-danger;
  }

  &__body {
    margin-bottom: $spacing-md;
  }

  &__title {
    display: block;
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $spacing-xs;
  }

  &__desc {
    display: block;
    font-size: $font-size-caption;
    color: $color-text-secondary;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: $spacing-md;
    border-top: 1px solid $color-border-light;
  }

  &__time {
    font-size: $font-size-caption;
    color: $color-text-placeholder;
  }

  &__status {
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;

    &--pending {
      color: $color-primary;
    }

    &--submitted {
      color: $color-success;
    }

    &--expired {
      color: $color-text-placeholder;
    }
  }
}
</style>
