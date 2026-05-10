<template>
  <view class="course-detail-page">
    <view class="header">
      <view class="back-btn" @click="goBack">
        <text>‹</text>
      </view>
      <view class="share-btn">
        <text>⋯</text>
      </view>
    </view>

    <image class="cover" :src="course.cover" mode="aspectFill" />

    <view class="content">
      <view class="course-info">
        <view class="title-row">
          <text class="title">{{ course.title }}</text>
          <view class="tag" v-if="course.tag">{{ course.tag }}</view>
        </view>
        <view class="meta">
          <view class="teacher">
            <image class="teacher-avatar" :src="course.teacherAvatar" mode="aspectFill" />
            <text class="teacher-name">{{ course.teacher }}</text>
          </view>
          <view class="students">{{ course.students }}人学习</view>
        </view>
        <view class="desc">{{ course.description }}</view>
      </view>

      <view class="course-progress" v-if="course.isEnrolled">
        <view class="progress-header">
          <text class="progress-label">学习进度</text>
          <text class="progress-text">{{ course.learnedCount }}/{{ course.totalCount }}</text>
        </view>
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
        </view>
      </view>

      <view class="chapters-section">
        <view class="section-title">课程目录</view>
        <view class="chapter-list">
          <view class="chapter-item" v-for="chapter in course.chapters" :key="chapter.id">
            <view class="chapter-header" @click="toggleChapter(chapter.id)">
              <text class="chapter-title">{{ chapter.title }}</text>
              <text class="chapter-arrow" :class="{ expanded: expandedChapters.includes(chapter.id) }">›</text>
            </view>
            <view class="lesson-list" v-show="expandedChapters.includes(chapter.id)">
              <view
                class="lesson-item"
                v-for="lesson in chapter.lessons"
                :key="lesson.id"
                @click="playLesson(lesson)"
              >
                <view class="lesson-status" :class="lesson.status">
                  <text v-if="lesson.status === 'completed'">✓</text>
                  <text v-else-if="lesson.status === 'locked'">🔒</text>
                  <text v-else>▶</text>
                </view>
                <view class="lesson-info">
                  <text class="lesson-title">{{ lesson.title }}</text>
                  <text class="lesson-duration">{{ lesson.duration }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="footer">
      <view class="price" v-if="!course.isEnrolled">
        <text class="price-value">¥{{ course.price }}</text>
        <text class="price-original" v-if="course.originalPrice > course.price">¥{{ course.originalPrice }}</text>
      </view>
      <Button
        :type="course.isEnrolled ? 'default' : 'primary'"
        size="large"
        @click="course.isEnrolled ? continueLearning() : enroll()"
      >
        {{ course.isEnrolled ? '继续学习' : '立即报名' }}
      </Button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const courseId = ref('')
const expandedChapters = ref([1])

const course = ref({
  id: 1,
  title: '少儿口才入门',
  teacher: '李老师',
  teacherAvatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=friendly%20female%20teacher%20avatar&image_size=square',
  students: 1280,
  price: 0,
  originalPrice: 299,
  tag: '免费',
  cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20speech%20training%20course%20cover&image_size=square',
  description: '专为4-12岁儿童设计的口才入门课程，通过趣味互动帮助孩子克服害羞，自信表达。',
  isEnrolled: true,
  learnedCount: 5,
  totalCount: 12,
  chapters: [
    {
      id: 1,
      title: '第一章 自我介绍',
      lessons: [
        { id: 1, title: '1.1 认识自己', duration: '15:00', status: 'completed' },
        { id: 2, title: '1.2 我的爱好', duration: '18:00', status: 'completed' },
        { id: 3, title: '1.3 家庭介绍', duration: '20:00', status: 'current' }
      ]
    },
    {
      id: 2,
      title: '第二章 发音练习',
      lessons: [
        { id: 4, title: '2.1 声母练习', duration: '22:00', status: 'locked' },
        { id: 5, title: '2.2 韵母练习', duration: '25:00', status: 'locked' }
      ]
    }
  ]
})

const progressPercent = computed(() => {
  return (course.value.learnedCount / course.value.totalCount) * 100
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options
  if (options.id) {
    courseId.value = options.id
  }
})

const goBack = () => {
  uni.navigateBack()
}

const toggleChapter = (id) => {
  const index = expandedChapters.value.indexOf(id)
  if (index > -1) {
    expandedChapters.value.splice(index, 1)
  } else {
    expandedChapters.value.push(id)
  }
}

const playLesson = (lesson) => {
  if (lesson.status === 'locked') {
    uni.showToast({ title: '请先报名课程', icon: 'none' })
    return
  }
  uni.showToast({ title: '开始播放', icon: 'success' })
}

const enroll = () => {
  if (course.value.price === 0) {
    course.value.isEnrolled = true
    uni.showToast({ title: '报名成功', icon: 'success' })
  } else {
    uni.showToast({ title: '请联系老师报名', icon: 'none' })
  }
}

const continueLearning = () => {
  const currentLesson = course.value.chapters
    .flatMap(ch => ch.lessons)
    .find(l => l.status === 'current')
  if (currentLesson) {
    playLesson(currentLesson)
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.course-detail-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 160rpx;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  padding: 80rpx $spacing-lg $spacing-md;

  .back-btn,
  .share-btn {
    width: 64rpx;
    height: 64rpx;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-white;
    font-size: 40rpx;
  }
}

.cover {
  width: 100%;
  height: 400rpx;
}

.content {
  padding: $spacing-lg;
  margin-top: -40rpx;
  position: relative;
  background: $color-bg-page;
  border-radius: 40rpx 40rpx 0 0;
}

.course-info {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;

  .title-row {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;

    .title {
      flex: 1;
      font-size: $font-size-h1;
      font-weight: $font-weight-bold;
      color: $color-text-primary;
    }

    .tag {
      padding: $spacing-xs $spacing-sm;
      background: $color-primary-light;
      color: $color-primary;
      font-size: $font-size-caption;
      border-radius: $radius-tag;
    }
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;

    .teacher {
      display: flex;
      align-items: center;
      gap: $spacing-sm;

      .teacher-avatar {
        width: 56rpx;
        height: 56rpx;
        border-radius: 50%;
      }

      .teacher-name {
        font-size: $font-size-body;
        color: $color-text-primary;
      }
    }

    .students {
      font-size: $font-size-caption;
      color: $color-text-secondary;
    }
  }

  .desc {
    font-size: $font-size-body;
    color: $color-text-secondary;
    line-height: 1.6;
  }
}

.course-progress {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;
  margin-bottom: $spacing-lg;

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;

    .progress-label {
      font-size: $font-size-h3;
      font-weight: $font-weight-semibold;
      color: $color-text-primary;
    }

    .progress-text {
      font-size: $font-size-body;
      color: $color-primary;
      font-weight: $font-weight-semibold;
    }
  }

  .progress-bar {
    height: 12rpx;
    background: $color-border-light;
    border-radius: 6rpx;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $color-primary 0%, #FF8A5B 100%);
      border-radius: 6rpx;
      transition: width 0.3s;
    }
  }
}

.chapters-section {
  .section-title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin-bottom: $spacing-md;
  }

  .chapter-list {
    .chapter-item {
      background: $color-bg-card;
      border-radius: $radius-card;
      margin-bottom: $spacing-md;
      overflow: hidden;

      .chapter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: $spacing-lg $spacing-xl;

        .chapter-title {
          font-size: $font-size-h3;
          font-weight: $font-weight-semibold;
          color: $color-text-primary;
        }

        .chapter-arrow {
          font-size: 36rpx;
          color: $color-text-secondary;
          transition: transform 0.3s;

          &.expanded {
            transform: rotate(90deg);
          }
        }
      }

      .lesson-list {
        border-top: 2rpx solid $color-border-light;

        .lesson-item {
          display: flex;
          align-items: center;
          padding: $spacing-md $spacing-xl;
          gap: $spacing-md;

          .lesson-status {
            width: 48rpx;
            height: 48rpx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24rpx;

            &.completed {
              background: $color-success-light;
              color: $color-success;
            }

            &.current {
              background: $color-primary-light;
              color: $color-primary;
            }

            &.locked {
              background: $color-border-light;
              color: $color-text-placeholder;
            }
          }

          .lesson-info {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .lesson-title {
              font-size: $font-size-body;
              color: $color-text-primary;
            }

            .lesson-duration {
              font-size: $font-size-caption;
              color: $color-text-secondary;
            }
          }
        }
      }
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: $color-bg-card;
  padding: $spacing-lg $spacing-xl;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.05);

  .price {
    display: flex;
    align-items: baseline;
    gap: $spacing-sm;

    .price-value {
      font-size: $font-size-h1;
      font-weight: $font-weight-bold;
      color: $color-primary;
    }

    .price-original {
      font-size: $font-size-body;
      color: $color-text-placeholder;
      text-decoration: line-through;
    }
  }
}
</style>
