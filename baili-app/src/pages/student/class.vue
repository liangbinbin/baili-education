<template>
  <view class="class-page">
    <Navbar title="我的班级" />

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

    <view class="class-list">
      <ClassCard
        v-for="cls in filteredClasses"
        :key="cls.id"
        :title="cls.title"
        :teacher="cls.teacher"
        :student-count="cls.studentCount"
        :schedule="cls.schedule"
        :status="cls.status"
        @click="goToDetail(cls.id)"
      />
      <EmptyState v-if="filteredClasses.length === 0" description="暂无班级" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getClassList } from '@/api/class'

const activeTab = ref('all')

const tabs = [
  { label: '全部班级', value: 'all' },
  { label: '线上班', value: 'online' },
  { label: '线下班', value: 'offline' }
]

const classList = ref([
  {
    id: 1,
    title: '演讲基础1班',
    teacher: '李老师',
    studentCount: 20,
    schedule: '周六 10:00-11:30',
    status: 'ongoing',
    type: 'offline'
  },
  {
    id: 2,
    title: '演讲基础2班',
    teacher: '王老师',
    studentCount: 18,
    schedule: '周日 14:00-15:30',
    status: 'ongoing',
    type: 'online'
  },
  {
    id: 3,
    title: '演讲进阶班',
    teacher: '张老师',
    studentCount: 15,
    schedule: '周六 16:00-17:30',
    status: 'ongoing',
    type: 'offline'
  }
])

const filteredClasses = computed(() => {
  if (activeTab.value === 'all') {
    return classList.value
  }
  return classList.value.filter(cls => cls.type === activeTab.value)
})

const loadClasses = async () => {
  try {
    const data = await getClassList({ type: activeTab.value })
    if (data && data.length > 0) {
      classList.value = data
    }
  } catch (error) {
    console.error('获取班级列表失败', error)
  }
}

onMounted(() => {
  loadClasses()
})

const goToDetail = (id) => {
  uni.navigateTo({ url: `/pages/student/class-detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.class-page {
  min-height: 100vh;
  background: $color-bg-page;
  padding-top: 88rpx;
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

.class-list {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}
</style>
