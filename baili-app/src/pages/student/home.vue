<template>
  <view class="home-page">
    <view class="header-section">
      <view class="user-info">
        <image class="avatar" :src="userStore.userInfo?.avatar || defaultAvatar" mode="aspectFill" />
        <view class="info">
          <text class="greeting">{{ greeting }}</text>
          <text class="name">{{ userStore.userInfo?.name || '同学' }}</text>
        </view>
      </view>
      <view class="points-card" @click="goToPoints">
        <text class="points-label">积分</text>
        <text class="points-value">{{ userPoints }}</text>
      </view>
    </view>

    <view class="quick-nav">
      <view class="nav-item" @click="goToTask">
        <view class="nav-icon task-icon">
          <text>📝</text>
        </view>
        <text class="nav-text">任务</text>
        <view v-if="pendingTaskCount > 0" class="badge">{{ pendingTaskCount }}</view>
      </view>
      <view class="nav-item" @click="goToCourse">
        <view class="nav-icon course-icon">
          <text>📚</text>
        </view>
        <text class="nav-text">课程</text>
      </view>
      <view class="nav-item" @click="goToClass">
        <view class="nav-icon class-icon">
          <text>👥</text>
        </view>
        <text class="nav-text">班级</text>
      </view>
      <view class="nav-item" @click="goToRanking">
        <view class="nav-icon ranking-icon">
          <text>🏆</text>
        </view>
        <text class="nav-text">排行榜</text>
      </view>
    </view>

    <view class="section-header">
      <text class="section-title">待办任务</text>
      <text class="section-more" @click="goToTask">查看全部 ›</text>
    </view>

    <view class="task-list">
      <TaskCard
        v-for="task in pendingTasks"
        :key="task.id"
        :task="task"
        @click="goToTaskDetail(task.id)"
      />
      <EmptyState v-if="pendingTasks.length === 0" description="暂无待办任务" />
    </view>

    <view class="section-header">
      <text class="section-title">推荐课程</text>
      <text class="section-more" @click="goToCourse">查看全部 ›</text>
    </view>

    <scroll-view class="course-scroll" scroll-x="true" show-scrollbar="false">
      <view class="course-list">
        <view
          class="course-item"
          v-for="course in recommendCourses"
          :key="course.id"
          @click="goToCourseDetail(course.id)"
        >
          <image class="course-cover" :src="course.cover" mode="aspectFill" />
          <text class="course-title">{{ course.title }}</text>
          <text class="course-teacher">{{ course.teacher }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { useTaskStore } from '@/store/task'
import { useCourseStore } from '@/store/course'

const userStore = useUserStore()
const taskStore = useTaskStore()
const courseStore = useCourseStore()

const defaultAvatar = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20student%20avatar&image_size=square'

const userPoints = ref(1280)
const pendingTaskCount = ref(3)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const pendingTasks = ref([
  {
    id: 1,
    title: '《演讲与口才》第3课作业',
    type: 'homework',
    deadline: '2024-01-15 23:59',
    status: 'pending'
  },
  {
    id: 2,
    title: '今日打卡：绕口令练习',
    type: 'checkin',
    deadline: '2024-01-12 23:59',
    status: 'pending'
  },
  {
    id: 3,
    title: '小组演讲准备',
    type: 'homework',
    deadline: '2024-01-18 23:59',
    status: 'pending'
  }
])

const recommendCourses = ref([
  {
    id: 1,
    title: '少儿口才入门',
    teacher: '李老师',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20speech%20training%20course%20cover&image_size=square'
  },
  {
    id: 2,
    title: '演讲技巧提升',
    teacher: '王老师',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=public%20speaking%20course%20cover&image_size=square'
  },
  {
    id: 3,
    title: '主持人培训',
    teacher: '张老师',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=host%20training%20course%20cover&image_size=square'
  }
])

onMounted(() => {
  if (userStore.isLoggedIn) {
    userStore.fetchUserInfo()
  }
})

const goToPoints = () => {
  uni.switchTab({ url: '/pages/student/points' })
}

const goToTask = () => {
  uni.switchTab({ url: '/pages/student/task' })
}

const goToTaskDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/task-detail?id=${id}` })
}

const goToCourse = () => {
  uni.navigateTo({ url: '/pages/student/course' })
}

const goToCourseDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/course-detail?id=${id}` })
}

const goToClass = () => {
  uni.navigateTo({ url: '/pages/student/class' })
}

const goToRanking = () => {
  uni.navigateTo({ url: '/pages/student/ranking' })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.home-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-bottom: 40rpx;
}

.header-section {
  background: linear-gradient(135deg, $color-primary 0%, #FF8A5B 100%);
  padding: 80rpx $spacing-xl $spacing-xl;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .user-info {
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .avatar {
      width: 104rpx;
      height: 104rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.3);
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: $spacing-xs;

      .greeting {
        font-size: $font-size-body;
        color: rgba(255, 255, 255, 0.8);
      }

      .name {
        font-size: $font-size-h2;
        font-weight: $font-weight-bold;
        color: $color-text-white;
      }
    }
  }

  .points-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10rpx);
    border-radius: $radius-card;
    padding: $spacing-md $spacing-lg;
    display: flex;
    flex-direction: column;
    align-items: center;

    .points-label {
      font-size: $font-size-caption;
      color: rgba(255, 255, 255, 0.8);
    }

    .points-value {
      font-size: $font-size-h1;
      font-weight: $font-weight-bold;
      color: $color-text-white;
    }
  }
}

.quick-nav {
  display: flex;
  justify-content: space-around;
  padding: $spacing-xl;
  margin-top: -40rpx;
  position: relative;
  z-index: 10;

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    position: relative;

    .nav-icon {
      width: 112rpx;
      height: 112rpx;
      border-radius: $radius-card;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;

      &.task-icon {
        background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
      }

      &.course-icon {
        background: linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%);
      }

      &.class-icon {
        background: linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%);
      }

      &.ranking-icon {
        background: linear-gradient(135deg, #FFECD2 0%, #FCB69F 100%);
      }
    }

    .nav-text {
      font-size: $font-size-body;
      color: $color-text-primary;
      font-weight: $font-weight-medium;
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      min-width: 36rpx;
      height: 36rpx;
      background: $color-danger;
      color: $color-text-white;
      font-size: 20rpx;
      border-radius: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 8rpx;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 $spacing-xl;
  margin-bottom: $spacing-md;

  .section-title {
    font-size: $font-size-h2;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  .section-more {
    font-size: $font-size-body;
    color: $color-text-secondary;
  }
}

.task-list {
  padding: 0 $spacing-xl;
}

.course-scroll {
  white-space: nowrap;
  padding: 0 $spacing-xl;

  .course-list {
    display: inline-flex;
    gap: $spacing-md;

    .course-item {
      display: inline-block;
      width: 280rpx;
      background: $color-bg-card;
      border-radius: $radius-card;
      overflow: hidden;
      box-shadow: $shadow-default;

      .course-cover {
        width: 100%;
        height: 160rpx;
      }

      .course-title {
        display: block;
        font-size: $font-size-body;
        font-weight: $font-weight-semibold;
        color: $color-text-primary;
        padding: $spacing-sm $spacing-md 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .course-teacher {
        display: block;
        font-size: $font-size-caption;
        color: $color-text-secondary;
        padding: $spacing-xs $spacing-md $spacing-md;
      }
    }
  }
}
</style>
