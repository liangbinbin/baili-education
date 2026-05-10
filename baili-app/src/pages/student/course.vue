<template>
  <view class="course-page">
    <Navbar title="课程" />

    <view class="search-section">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索课程"
        />
      </view>
    </view>

    <scroll-view class="tab-scroll" scroll-x="true" show-scrollbar="false">
      <view class="tab-list">
        <view
          class="tab-item"
          :class="{ active: activeTab === item.value }"
          v-for="item in tabs"
          :key="item.value"
          @click="activeTab = item.value"
        >
          {{ item.label }}
        </view>
      </view>
    </scroll-view>

    <view class="course-list">
      <CourseCard
        v-for="course in filteredCourses"
        :key="course.id"
        :cover="course.cover"
        :title="course.title"
        :teacher="course.teacher"
        :students="course.students"
        :price="course.price"
        :original-price="course.originalPrice"
        :tag="course.tag"
        @click="goToDetail(course.id)"
      />
      <EmptyState v-if="filteredCourses.length === 0" description="暂无课程" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const activeTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '入门', value: 'beginner' },
  { label: '进阶', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

const courseList = ref([
  {
    id: 1,
    title: '少儿口才入门',
    teacher: '李老师',
    students: 1280,
    price: 0,
    originalPrice: 299,
    tag: '免费',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kids%20speech%20training%20course%20cover&image_size=square',
    category: 'beginner'
  },
  {
    id: 2,
    title: '演讲技巧提升',
    teacher: '王老师',
    students: 856,
    price: 199,
    originalPrice: 399,
    tag: '热门',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=public%20speaking%20course%20cover&image_size=square',
    category: 'intermediate'
  },
  {
    id: 3,
    title: '主持人培训',
    teacher: '张老师',
    students: 520,
    price: 299,
    originalPrice: 599,
    tag: '',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=host%20training%20course%20cover&image_size=square',
    category: 'advanced'
  },
  {
    id: 4,
    title: '绕口令专项训练',
    teacher: '刘老师',
    students: 642,
    price: 99,
    originalPrice: 199,
    tag: '',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tongue%20twister%20training%20course%20cover&image_size=square',
    category: 'beginner'
  }
])

const filteredCourses = computed(() => {
  let result = courseList.value
  
  if (activeTab.value !== 'all') {
    result = result.filter(course => course.category === activeTab.value)
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(course => 
      course.title.toLowerCase().includes(keyword) ||
      course.teacher.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/course-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.course-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
}

.search-section {
  padding: $spacing-lg;
  background: $color-bg-card;

  .search-box {
    background: $color-bg-page;
    border-radius: $radius-full;
    padding: $spacing-sm $spacing-lg;
    display: flex;
    align-items: center;
    gap: $spacing-sm;

    .search-icon {
      font-size: 32rpx;
    }

    .search-input {
      flex: 1;
      font-size: $font-size-body;
      height: 48rpx;
      line-height: 48rpx;
    }
  }
}

.tab-scroll {
  background: $color-bg-card;
  white-space: nowrap;
  padding: 0 $spacing-lg;

  .tab-list {
    display: inline-flex;
    gap: $spacing-xl;
    padding: $spacing-md 0;

    .tab-item {
      font-size: $font-size-body;
      color: $color-text-secondary;
      padding: $spacing-xs 0;
      position: relative;
      white-space: nowrap;

      &.active {
        color: $color-primary;
        font-weight: $font-weight-semibold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 40rpx;
          height: 6rpx;
          background: $color-primary;
          border-radius: 3rpx;
        }
      }
    }
  }
}

.course-list {
  padding: $spacing-lg;
}
</style>
