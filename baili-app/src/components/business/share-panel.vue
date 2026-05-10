<template>
  <view class="bl-share-panel">
    <view class="bl-share-panel__header">
      <text class="bl-share-panel__title">分享到</text>
    </view>
    <view class="bl-share-panel__options">
      <view
        v-for="option in shareOptions"
        :key="option.type"
        class="bl-share-panel__option"
        @click="handleShare(option.type)"
      >
        <view class="bl-share-panel__icon" :class="`bl-share-panel__icon--${option.type}`">
          <text>{{ option.icon }}</text>
        </view>
        <text class="bl-share-panel__label">{{ option.label }}</text>
      </view>
    </view>
    <view class="bl-share-panel__footer">
      <view class="bl-share-panel__cancel" @click="handleCancel">
        <text>取消</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const shareOptions = ref([
  { type: 'wechat', label: '微信好友', icon: '💬' },
  { type: 'moments', label: '朋友圈', icon: '⭕' },
  { type: 'qq', label: 'QQ', icon: '🐧' },
  { type: 'qzone', label: 'QQ空间', icon: '⭐' },
  { type: 'weibo', label: '微博', icon: '🔴' },
  { type: 'poster', label: '生成海报', icon: '🖼️' }
])

const emit = defineEmits(['share', 'cancel'])

const handleShare = (type) => {
  emit('share', type)
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-share-panel {
  background: $color-bg-card;
  border-radius: $radius-card $radius-card 0 0;
  padding: $spacing-xl;

  &__header {
    text-align: center;
    margin-bottom: $spacing-xl;
  }

  &__title {
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__options {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-lg;
  }

  &__option {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: $spacing-md 0;
  }

  &__icon {
    width: 96rpx;
    height: 96rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-sm;
    font-size: 40rpx;

    &--wechat {
      background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
    }

    &--moments {
      background: linear-gradient(135deg, #07c160 0%, #06ad56 100%);
    }

    &--qq {
      background: linear-gradient(135deg, #12b7f5 0%, #0099d8 100%);
    }

    &--qzone {
      background: linear-gradient(135deg, #feca57 0%, #ff9f43 100%);
    }

    &--weibo {
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    }

    &--poster {
      background: linear-gradient(135deg, #a55eea 0%, #8854d0 100%);
    }
  }

  &__label {
    font-size: $font-size-caption;
    color: $color-text-secondary;
  }

  &__footer {
    margin-top: $spacing-xl;
    padding-top: $spacing-xl;
    border-top: 1px solid $color-border-light;
  }

  &__cancel {
    text-align: center;
    padding: $spacing-md;
    font-size: $font-size-body;
    color: $color-text-secondary;
  }
}
</style>
