<template>
  <view class="ranking-page">
    <Navbar title="排行榜" />

    <view class="tabs">
      <view
        v-for="tab in tabList"
        :key="tab.value"
        class="tab-item"
        :class="{ active: rankingPeriod === tab.value }"
        @click="setRankingPeriod(tab.value)"
      >
        {{ tab.label }}
      </view>
    </view>

    <view class="scope-tabs">
      <view
        v-for="scope in scopeList"
        :key="scope.value"
        class="scope-item"
        :class="{ active: rankingScope === scope.value }"
        @click="setRankingScope(scope.value)"
      >
        {{ scope.label }}
      </view>
    </view>

    <view class="top-three">
      <view class="top-item second" v-if="topThreeList[1]">
        <text class="top-trophy">🥈</text>
        <image class="top-avatar" :src="topThreeList[1].studentId?.avatar || defaultAvatar" mode="aspectFill" />
        <text class="top-name">{{ topThreeList[1].studentId?.name }}</text>
        <text class="top-points">{{ topThreeList[1].points }}分</text>
      </view>

      <view class="top-item first" v-if="topThreeList[0]">
        <text class="top-trophy">🥇</text>
        <image class="top-avatar" :src="topThreeList[0].studentId?.avatar || defaultAvatar" mode="aspectFill" />
        <text class="top-name">{{ topThreeList[0].studentId?.name }}</text>
        <text class="top-points">{{ topThreeList[0].points }}分</text>
      </view>

      <view class="top-item third" v-if="topThreeList[2]">
        <text class="top-trophy">🥉</text>
        <image class="top-avatar" :src="topThreeList[2].studentId?.avatar || defaultAvatar" mode="aspectFill" />
        <text class="top-name">{{ topThreeList[2].studentId?.name }}</text>
        <text class="top-points">{{ topThreeList[2].points }}分</text>
      </view>
    </view>

    <view class="my-rank" v-if="ranking.myRank">
      <text class="my-rank-number">🏅 {{ ranking.myRank.rank }}</text>
      <text class="my-rank-points">{{ ranking.myRank.points }}分</text>
    </view>

    <view class="ranking-list">
      <RankingItem
        v-for="(item, index) in restList"
        :key="item._id || index"
        :rank="item.rank"
        :name="item.studentId?.name"
        :avatar="item.studentId?.avatar"
        :score="item.points"
        :isMe="item.isMe"
      />
    </view>

    <EmptyState v-if="ranking.list.length === 0 && !loading" text="暂无排行榜数据" />
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePointsStore } from '@/store/points'
import Navbar from '@/components/common/navbar.vue'
import RankingItem from '@/components/business/ranking-item.vue'
import EmptyState from '@/components/common/empty-state.vue'

const pointsStore = usePointsStore()
const {
  ranking,
  rankingPeriod,
  rankingScope,
  loading,
  fetchRanking,
  setRankingPeriod,
  setRankingScope
} = pointsStore

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text-to-image?prompt=cute%20cartoon%20child%20avatar&image-size=square'

const tabList = [
  { label: '周榜', value: 'week' },
  { label: '月榜', value: 'month' },
  { label: '年榜', value: 'year' }
]

const scopeList = [
  { label: '本班', value: 'class' },
  { label: '全校', value: 'school' }
]

const topThreeList = computed(() => ranking.value.list?.slice(0, 3) || [])
const restList = computed(() => ranking.value.list?.slice(3) || [])

onMounted(() => {
  fetchRanking()
})
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.ranking-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
  padding-bottom: 40rpx;
}

.tabs {
  display: flex;
  background: $color-bg-card;
  padding: $spacing-sm;
  margin: $spacing-lg;
  border-radius: $radius-card;
  gap: $spacing-sm;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: $spacing-sm 0;
    font-size: $font-size-body;
    color: $color-text-secondary;
    border-radius: $radius-tag;
    transition: all $transition-fast;

    &.active {
      background: $color-primary;
      color: $color-text-white;
      font-weight: $font-weight-medium;
    }
  }
}

.scope-tabs {
  display: flex;
  background: $color-bg-card;
  padding: $spacing-sm;
  margin: 0 $spacing-lg $spacing-lg;
  border-radius: $radius-card;
  gap: $spacing-sm;

  .scope-item {
    flex: 1;
    text-align: center;
    padding: $spacing-sm 0;
    font-size: $font-size-body;
    color: $color-text-secondary;
    border-radius: $radius-tag;
    transition: all $transition-fast;

    &.active {
      background: $color-info-light;
      color: $color-info;
      font-weight: $font-weight-medium;
    }
  }
}

.top-three {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: $spacing-xl $spacing-lg;
  gap: $spacing-lg;

  .top-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    position: relative;

    .top-trophy {
      font-size: 40rpx;
      position: absolute;
      top: -10rpx;
      z-index: 1;
    }

    .top-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid $color-bg-card;
      box-shadow: $shadow-card;
    }

    .top-name {
      font-size: $font-size-body;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
      max-width: 140rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .top-points {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }

    &.first {
      .top-avatar {
        width: 150rpx;
        height: 150rpx;
        border-color: $color-rank-1;
      }
    }

    &.second {
      .top-avatar {
        border-color: $color-rank-2;
      }
    }

    &.third {
      .top-avatar {
        border-color: $color-rank-3;
      }
    }
  }
}

.my-rank {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, $color-primary-light 0%, rgba($color-primary, 0.05) 100%);
  margin: 0 $spacing-lg $spacing-lg;
  padding: $spacing-xl;
  border-radius: $radius-card;
  border: 2rpx solid $color-primary-light;

  .my-rank-number {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }

  .my-rank-points {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-primary;
  }
}

.ranking-list {
  padding: 0 $spacing-lg;
}
</style>
