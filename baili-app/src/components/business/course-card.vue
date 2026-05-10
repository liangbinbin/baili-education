<template>
  <view class="bl-course-card" @click="handleClick">
    <view class="bl-course-card__cover">
      <image :src="cover" mode="aspectFill" class="bl-course-card__img" />
      <view v-if="tag" class="bl-course-card__tag">{{ tag }}</view>
    </view>
    <view class="bl-course-card__content">
      <text class="bl-course-card__title">{{ title }}</text>
      <view class="bl-course-card__meta">
        <view class="bl-course-card__teacher">
          <text>{{ teacher }}</text>
        </view>
        <view class="bl-course-card__students">
          <text>{{ students }}人学习</text>
        </view>
      </view>
      <view class="bl-course-card__footer">
        <view class="bl-course-card__price">
          <text v-if="price > 0">¥{{ price }}</text>
          <text v-else class="bl-course-card__free">免费</text>
        </view>
        <view v-if="originalPrice > price" class="bl-course-card__original">
          ¥{{ originalPrice }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  cover: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  teacher: {
    type: String,
    default: ''
  },
  students: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    default: 0
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  tag: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-course-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  overflow: hidden;
  box-shadow: $shadow-default;

  &__cover {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
  }

  &__img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__tag {
    position: absolute;
    top: $spacing-sm;
    left: $spacing-sm;
    background: $color-primary;
    color: $color-text-white;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;
    font-size: $font-size-caption;
    font-weight: $font-weight-medium;
  }

  &__content {
    padding: $spacing-lg;
  }

  &__title {
    display: block;
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $spacing-sm;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-sm;
  }

  &__teacher,
  &__students {
    font-size: $font-size-caption;
    color: $color-text-secondary;
  }

  &__footer {
    display: flex;
    align-items: baseline;
  }

  &__price {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-primary;
    margin-right: $spacing-sm;

    .bl-course-card__free {
      color: $color-success;
    }
  }

  &__original {
    font-size: $font-size-caption;
    color: $color-text-placeholder;
    text-decoration: line-through;
  }
}
</style>
