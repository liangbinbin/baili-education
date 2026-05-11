<template>
  <view class="points-page">
    <Navbar title="积分中心" />

    <view class="points-card">
      <view class="points-header">
        <text class="points-label">当前积分</text>
        <text class="points-value">{{ stats.current }}</text>
      </view>
      <view class="points-stats">
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalEarned }}</text>
          <text class="stat-label">累计获得</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.totalDeducted }}</text>
          <text class="stat-label">累计扣除</text>
        </view>
      </view>
    </view>

    <view class="rules-card">
      <view class="rules-header">
        <text class="rules-icon">📖</text>
        <text class="rules-title">积分规则</text>
      </view>
      <view class="rules-list">
        <view class="rule-item">
          <text class="rule-dot"></text>
          <text class="rule-text">每日打卡：+10积分</text>
        </view>
        <view class="rule-item">
          <text class="rule-dot"></text>
          <text class="rule-text">完成作业：+20积分</text>
        </view>
        <view class="rule-item">
          <text class="rule-dot"></text>
          <text class="rule-text">连续打卡：+5~50积分</text>
        </view>
        <view class="rule-item">
          <text class="rule-dot"></text>
          <text class="rule-text">分享作业：+5积分</text>
        </view>
      </view>
    </view>

    <view class="quick-actions">
      <view class="action-item" @click="goToRanking">
        <text class="action-icon">🏆</text>
        <text class="action-text">排行榜</text>
      </view>
      <view class="action-item" @click="goToRecords">
        <text class="action-icon">📜</text>
        <text class="action-text">积分记录</text>
      </view>
    </view>

    <view class="week-section">
      <view class="section-header">
        <text class="section-title">本周积分获取</text>
      </view>
      <view class="week-list">
        <view
          v-for="(item, index) in weekDays"
          :key="index"
          class="week-item"
          :class="{ earned: item.earned }"
        >
          <text class="week-day">{{ item.day }}</text>
          <text class="week-points">{{ item.points > 0 ? '+' + item.points : item.points }}</text>
          <text class="week-icon" v-if="item.earned">✓</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePointsStore } from '@/store/points'
import Navbar from '@/components/common/navbar.vue'

const pointsStore = usePointsStore()
const { stats, fetchStats } = pointsStore

const weekDays = computed(() => {
  const defaultDays = [
    { day: '周一', points: 0, earned: false },
    { day: '周二', points: 0, earned: false },
    { day: '周三', points: 0, earned: false },
    { day: '周四', points: 0, earned: false },
    { day: '周五', points: 0, earned: false },
    { day: '周六', points: 0, earned: false },
    { day: '周日', points: 0, earned: false }
  ]
  
  if (stats.value?.weekRecords?.length > 0) {
    stats.value.weekRecords.forEach((record, index) => {
      if (defaultDays[index]) {
        defaultDays[index] = { ...defaultDays[index], ...record }
    })
  }
  
  return defaultDays
})

const goToRanking = () => {
  uni.navigateTo({
    url: '/pages/student/ranking'
  })
}

const goToRecords = () => {
  uni.navigateTo({
    url: '/pages/student/task-records'
  })
}

onMounted(() => {
  fetchStats()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.points-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 40rpx;
}

.points-card {
  margin: $spacing-lg;
  background: linear-gradient(135deg, $color-primary 0%, #FF8A5B 100%);
  border-radius: $radius-card;
  padding: $spacing-xl;
  box-shadow: $shadow-card;

  .points-header {
    text-align: center;
    margin-bottom: $spacing-xl;
  }

  .points-label {
    display: block;
    font-size: $font-size-body;
    color: rgba($color-text-white, 0.8);
    margin-bottom: $spacing-xs;
  }

  .points-value {
    display: block;
    font-size: 80rpx;
    font-weight: $font-weight-bold;
    color: $color-text-white;
  }

  .points-stats {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: $spacing-lg;
    border-top: 2rpx solid rgba($color-text-white, 0.2);

    .stat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;
      text-align: center;

      .stat-value {
        font-size: $font-size-h2;
        font-weight: $font-weight-semibold;
        color: $color-text-white;
      }

      .stat-label {
        font-size: $font-size-caption;
        color: rgba($color-text-white, 0.8);
      }
    }

    .stat-divider {
      width: 2rpx;
      height: 60rpx;
      background: rgba($color-text-white, 0.2);
    }
  }
}

.rules-card {
  margin: 0 $spacing-lg $spacing-lg;
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  box-shadow: $shadow-default;

  .rules-header {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-lg;

    .rules-icon {
      font-size: 36rpx;
    }

    .rules-title {
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }

  .rules-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    .rule-item {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .rule-dot {
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background: $color-primary;
        flex-shrink: 0;
      }

      .rule-text {
        font-size: $font-size-body;
        color: $color-text-secondary;
      }
    }
  }
}

.quick-actions {
  display: flex;
  gap: $spacing-md;
  margin: 0 $spacing-lg $spacing-lg;

  .action-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    background: $color-bg-card;
    border-radius: $radius-card;
    padding: $spacing-xl;
    box-shadow: $shadow-default;
    transition: all $transition-fast;

    &:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    .action-icon {
      font-size: 48rpx;
    }

    .action-text {
      font-size: $font-size-body;
      font-weight: $font-weight-medium;
      color: $color-text-primary;
    }
  }
}

.week-section {
  margin: 0 $spacing-lg;
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  box-shadow: $shadow-default;

  .section-header {
    margin-bottom: $spacing-lg;

    .section-title {
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }
  }

  .week-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;

    .week-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $spacing-md $spacing-sm;
      border-radius: $radius-sm;
      background: $color-bg-page;

      &.earned {
        background: $color-success-light;
      }

      .week-day {
        font-size: $font-size-body;
        color: $color-text-secondary;
        flex: 1;
      }

      .week-points {
        font-size: $font-size-h3;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
        margin-right: $spacing-md;
      }

      .week-icon {
        font-size: 24rpx;
        color: $color-success;
      }
    }
  }
}
</style>
