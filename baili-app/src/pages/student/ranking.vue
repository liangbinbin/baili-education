<template>
  <view class="ranking-page">
    <Navbar title="排行榜" />

    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'week' }"
        @click="activeTab = 'week'"
      >
        本周排行
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'month' }"
        @click="activeTab = 'month'"
      >
        本月排行
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'total' }"
        @click="activeTab = 'total'"
      >
        总排行
      </view>
    </view>

    <view class="top-three">
      <view class="top-item second" v-if="rankingList[1]">
        <image class="avatar" :src="rankingList[1].avatar" mode="aspectFill" />
        <text class="rank-badge">2</text>
        <text class="name">{{ rankingList[1].name }}</text>
        <text class="points">{{ rankingList[1].points }}积分</text>
      </view>

      <view class="top-item first" v-if="rankingList[0]">
        <image class="avatar" :src="rankingList[0].avatar" mode="aspectFill" />
        <text class="rank-badge">👑</text>
        <text class="name">{{ rankingList[0].name }}</text>
        <text class="points">{{ rankingList[0].points }}积分</text>
      </view>

      <view class="top-item third" v-if="rankingList[2]">
        <image class="avatar" :src="rankingList[2].avatar" mode="aspectFill" />
        <text class="rank-badge">3</text>
        <text class="name">{{ rankingList[2].name }}</text>
        <text class="points">{{ rankingList[2].points }}积分</text>
      </view>
    </view>

    <view class="ranking-list">
      <RankingItem
        v-for="(item, index) in rankingList.slice(3)"
        :key="item.id"
        :rank="index + 4"
        :name="item.name"
        :avatar="item.avatar"
        :points="item.points"
        :isMe="item.isMe"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('week')

const rankingList = ref([
  {
    id: 1,
    name: '小红',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20girl%20avatar%201&image_size=square',
    points: 1890,
    isMe: false
  },
  {
    id: 2,
    name: '小明',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar%202&image_size=square',
    points: 1650,
    isMe: true
  },
  {
    id: 3,
    name: '小华',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20child%20avatar%203&image_size=square',
    points: 1420,
    isMe: false
  },
  {
    id: 4,
    name: '小丽',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20girl%20avatar%204&image_size=square',
    points: 1280,
    isMe: false
  },
  {
    id: 5,
    name: '小强',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar%205&image_size=square',
    points: 1150,
    isMe: false
  }
])
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.ranking-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
}

.tabs {
  display: flex;
  background: $color-bg-card;
  padding: $spacing-sm;
  margin: 0 $spacing-lg $spacing-lg;
  border-radius: $radius-card;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: $spacing-sm 0;
    font-size: $font-size-body;
    color: $color-text-secondary;
    border-radius: $radius-tag;
    transition: all 0.3s;

    &.active {
      background: $color-primary;
      color: $color-text-white;
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
    gap: $spacing-xs;
    position: relative;

    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      border: 4rpx solid $color-bg-card;
    }

    .rank-badge {
      position: absolute;
      top: 80rpx;
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: $font-size-body;
      font-weight: $font-weight-bold;
      color: $color-text-white;
    }

    .name {
      font-size: $font-size-body;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }

    .points {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }

    &.first {
      .avatar {
        width: 150rpx;
        height: 150rpx;
        border-color: $color-rank-1;
      }

      .rank-badge {
        top: 105rpx;
        background: $color-rank-1;
        font-size: 28rpx;
      }
    }

    &.second {
      .avatar {
        border-color: $color-rank-2;
      }

      .rank-badge {
        background: $color-rank-2;
      }
    }

    &.third {
      .avatar {
        border-color: $color-rank-3;
      }

      .rank-badge {
        background: $color-rank-3;
      }
    }
  }
}

.ranking-list {
  padding: 0 $spacing-lg;
}
</style>
