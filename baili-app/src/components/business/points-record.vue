<template>
  <view class="bl-points-record">
    <view class="bl-points-record__icon">{{ icon }}</view>
    <view class="bl-points-record__content">
      <view class="bl-points-record__header">
        <text class="bl-points-record__title">{{ title }}</text>
        <text
          class="bl-points-record__points"
          :class="points > 0 ? 'bl-points-record__points--plus' : 'bl-points-record__points--minus'"
        >
          {{ points > 0 ? '+' : '' }}{{ points }}
        </text>
      </view>
      <view class="bl-points-record__footer">
        <text class="bl-points-record__time">{{ time }}</text>
        <text v-if="balance !== null" class="bl-points-record__balance">余额：{{ balance }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: '✅'
  },
  title: {
    type: String,
    default: ''
  },
  points: {
    type: Number,
    default: 0
  },
  time: {
    type: String,
    default: ''
  },
  balance: {
    type: Number,
    default: null
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-points-record {
  display: flex;
  align-items: center;
  padding: $spacing-lg 0;
  border-bottom: 1px solid $color-border-light;

  &:last-child {
    border-bottom: none;
  }

  &__icon {
    font-size: 40rpx;
    margin-right: $spacing-md;
    flex-shrink: 0;
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

  &__title {
    font-size: $font-size-body;
    color: $color-text-primary;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__points {
    font-size: $font-size-h3;
    font-weight: $font-weight-bold;
    flex-shrink: 0;
    margin-left: $spacing-md;

    &--plus {
      color: $color-success;
    }

    &--minus {
      color: $color-danger;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__time,
  &__balance {
    font-size: $font-size-caption;
    color: $color-text-placeholder;
  }
}
</style>
