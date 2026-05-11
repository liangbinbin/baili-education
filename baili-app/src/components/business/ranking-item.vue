<template>
  <view class="ranking-item" :class="{ 'ranking-item--top': rank <= 3 }">
    <view class="ranking-item__rank" :class="`ranking-item__rank--${rank}`">
      <text v-if="rank <= 3">{{ getRankIcon(rank) }}</text>
      <text v-else>{{ rank }}</text>
    </view>
    <view class="ranking-item__avatar">
      <image :src="avatar || defaultAvatar" mode="aspectFill" class="ranking-item__img" />
      <view v-if="rank === 1" class="ranking-item__crown">👑</view>
    </view>
    <view class="ranking-item__info">
      <text class="ranking-item__name">{{ name }}</text>
      <text v-if="description" class="ranking-item__desc">{{ description }}</text>
    </view>
    <view class="ranking-item__score">
      <text class="ranking-item__score-value">{{ score }}</text>
      <text class="ranking-item__score-unit">{{ unit }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  rank: {
    type: Number,
    default: 1
  },
  avatar: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: '分'
  }
})

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text-to-image?prompt=cute%20cartoon%20child%20avatar&image-size=square'

const getRankIcon = (rank) => {
  const icons = ['🥇', '🥈', '🥉']
  return icons[rank - 1]
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.ranking-item {
  display: flex;
  align-items: center;
  padding: $spacing-lg $spacing-xl;
  background: $color-bg-card;
  border-radius: $radius-card;
  margin-bottom: $spacing-md;

  &--top {
    box-shadow: $shadow-card;
  }

  &__rank {
    width: 50rpx;
    text-align: center;
    font-size: $font-size-h3;
    font-weight: $font-weight-bold;
    color: $color-text-secondary;
    margin-right: $spacing-md;

    &--1 {
      color: $color-rank-1;
    }

    &--2 {
      color: $color-rank-2;
    }

    &--3 {
      color: $color-rank-3;
    }
  }

  &__avatar {
    position: relative;
    margin-right: $spacing-md;
  }

  &__img {
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
  }

  &__crown {
    position: absolute;
    top: -20rpx;
    left: 50%;
    transform: translateX(-50%);
    font-size: 32rpx;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    display: block;
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $spacing-xs;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    display: block;
    font-size: $font-size-caption;
    color: $color-text-secondary;
  }

  &__score {
    display: flex;
    align-items: baseline;
  }

  &__score-value {
    font-size: $font-size-h1;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }

  &__score-unit {
    font-size: $font-size-caption;
    color: $color-text-secondary;
    margin-left: $spacing-xs;
  }
}
</style>
