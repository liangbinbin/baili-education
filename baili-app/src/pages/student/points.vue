<template>
  <view class="points-page">
    <view class="header">
      <text class="title">积分</text>
    </view>

    <view class="points-card">
      <text class="points-label">我的积分</text>
      <text class="points-value">{{ totalPoints }}</text>
      <view class="points-stats">
        <view class="stat-item">
          <text class="stat-value">{{ weekPoints }}</text>
          <text class="stat-label">本周获得</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ monthPoints }}</text>
          <text class="stat-label">本月获得</text>
        </view>
      </view>
    </view>

    <PointsRule />

    <view class="records-section">
      <view class="section-header">
        <text class="section-title">积分明细</text>
      </view>
      <PointsRecord />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const totalPoints = ref(1280)
const weekPoints = ref(156)
const monthPoints = ref(420)
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.points-page {
  min-height: 100vh;
  background: $color-bg-page;
}

.header {
  background: linear-gradient(135deg, $color-primary 0%, #FF8A5B 100%);
  padding: 80rpx $spacing-xl $spacing-xl;

  .title {
    font-size: $font-size-h1;
    font-weight: $font-weight-bold;
    color: $color-text-white;
  }
}

.points-card {
  margin: -40rpx $spacing-lg $spacing-lg;
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  text-align: center;
  box-shadow: $shadow-card;

  .points-label {
    display: block;
    font-size: $font-size-body;
    color: $color-text-secondary;
    margin-bottom: $spacing-xs;
  }

  .points-value {
    display: block;
    font-size: 80rpx;
    font-weight: $font-weight-bold;
    color: $color-primary;
    margin-bottom: $spacing-lg;
  }

  .points-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: $spacing-lg;
    border-top: 2rpx solid $color-border-light;

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      .stat-value {
        font-size: $font-size-h2;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
      }

      .stat-label {
        font-size: $font-size-caption;
        color: $color-text-secondary;
      }
    }

    .stat-divider {
      width: 2rpx;
      height: 60rpx;
      background: $color-border-light;
    }
  }
}

.records-section {
  padding: 0 $spacing-lg;

  .section-header {
    margin-bottom: $spacing-md;

    .section-title {
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }
}
</style>
