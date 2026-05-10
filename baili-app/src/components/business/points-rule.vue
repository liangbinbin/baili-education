<template>
  <view class="bl-points-rule">
    <view class="bl-points-rule__item" v-for="(rule, index) in rules" :key="index">
      <view class="bl-points-rule__icon">{{ rule.icon }}</view>
      <view class="bl-points-rule__info">
        <text class="bl-points-rule__name">{{ rule.name }}</text>
        <text class="bl-points-rule__desc">{{ rule.desc }}</text>
      </view>
      <view class="bl-points-rule__points">
        <text v-if="rule.points > 0">+{{ rule.points }}</text>
        <text v-else>{{ rule.points }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  rules: {
    type: Array,
    default: () => [
      { icon: '✅', name: '完成作业', desc: '每完成一次作业', points: 10 },
      { icon: '📅', name: '每日打卡', desc: '每天签到打卡', points: 5 },
      { icon: '📝', name: '连续打卡', desc: '连续7天额外奖励', points: 20 },
      { icon: '🏆', name: '获得优秀', desc: '作业被评为优秀', points: 30 },
      { icon: '👥', name: '邀请好友', desc: '成功邀请一位好友', points: 50 },
      { icon: '⏰', name: '超时提交', desc: '超过截止时间提交', points: -5 }
    ]
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-points-rule {
  &__item {
    display: flex;
    align-items: center;
    padding: $spacing-lg 0;
    border-bottom: 1px solid $color-border-light;

    &:last-child {
      border-bottom: none;
    }
  }

  &__icon {
    font-size: 40rpx;
    margin-right: $spacing-md;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-size: $font-size-body;
    color: $color-text-primary;
    margin-bottom: $spacing-xs;
  }

  &__desc {
    font-size: $font-size-caption;
    color: $color-text-placeholder;
  }

  &__points {
    font-size: $font-size-h3;
    font-weight: $font-weight-bold;
    flex-shrink: 0;

    text {
      &:first-child {
        color: $color-success;
      }

      &:last-child {
        color: $color-danger;
      }
    }
  }
}
</style>
