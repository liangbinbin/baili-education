<template>
  <view class="course-card" @click="handleClick">
    <view class="course-card__cover">
      <image :src="cover" mode="aspectFill" class="course-card__img" />
    </view>
    <view class="course-card__content">
      <text class="course-card__title">{{ title }}</text>
      <view class="course-card__meta">
        <text class="course-card__level">级别：{{ level }}</text>
        <text class="course-card__lessons">课时：{{ lessons }}课时</text>
      </view>
      <view class="course-card__classes">
        <view class="course-card__class-tag" v-for="(cls, index) in previewClasses" :key="index">
          <text>{{ cls }}</text>
        </view>
        <view v-if="moreClasses > 0" class="course-card__more">
          <text>+{{ moreClasses }}个班</text>
        </view>
      </view>
      <view class="course-card__status">
        <text :class="['course-card__status-text', statusClass]">{{ statusText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cover: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    default: '入门级'
  },
  lessons: {
    type: Number,
    default: 0
  },
  previewClasses: {
    type: Array,
    default: () => []
  },
  moreClasses: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'enrolling' // enrolling, ongoing, finished
  }
})

const emit = defineEmits(['click'])

const statusClass = computed(() => {
  const map = {
    enrolling: 'enrolling',
    ongoing: 'ongoing',
    finished: 'finished'
  }
  return map[props.status] || 'enrolling'
})

const statusText = computed(() => {
  const map = {
    enrolling: '报名中',
    ongoing: '进行中',
    finished: '已结课'
  }
  return map[props.status] || '报名中'
})

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.course-card {
  background: $color-bg-card;
  border-radius: $radius-card;
  overflow: hidden;
  box-shadow: $shadow-card;

  &__cover {
    position: relative;
    width: 100%;
    padding-top: 56.25%;
    background: $color-bg-page;
  }

  &__img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__content {
    padding: $spacing-lg;
  }

  &__title {
    display: block;
    font-size: $font-size-h3;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
    margin-bottom: $spacing-md;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    display: flex;
    gap: $spacing-lg;
    margin-bottom: $spacing-md;

    &-text {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }
  }

  &__level,
  &__lessons {
    font-size: $font-size-caption;
    color: $color-text-secondary;
  }

  &__classes {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
    margin-bottom: $spacing-md;
  }

  &__class-tag {
    background: $color-bg-page;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;

    text {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }
  }

  &__more {
    background: $color-bg-page;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-tag;

    text {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }
  }

  &__status {
    &-text {
      display: inline-block;
      padding: $spacing-xs $spacing-sm;
      border-radius: $radius-tag;
      font-size: $font-size-caption;
      font-weight: $font-weight-medium;

      &.enrolling {
        background: $color-info-light;
        color: $color-info;
      }

      &.ongoing {
        background: $color-success-light;
        color: $color-success;
      }

      &.finished {
        background: $color-border-light;
        color: $color-text-placeholder;
      }
    }
  }
}
</style>
