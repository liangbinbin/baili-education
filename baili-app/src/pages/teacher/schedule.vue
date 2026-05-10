<script setup>
import { ref, onMounted } from 'vue'

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const currentDay = ref(0)

const scheduleData = ref([
  { time: '09:00-10:30', course: '口才基础班', class: '启蒙A班', room: '教室1' },
  { time: '14:00-15:30', course: '演讲进阶班', class: '进阶B班', room: '教室2' },
  { time: '16:00-17:30', course: '少儿主持班', class: '主持C班', room: '教室3' }
])
</script>

<template>
  <view class="schedule">
    <Navbar title="排课管理" />
    
    <view class="week-tabs">
      <view 
        v-for="(day, index) in weekDays" 
        :key="index"
        class="week-tab"
        :class="{ active: currentDay === index }"
        @tap="currentDay = index"
      >
        <text class="week-day">{{ day }}</text>
      </view>
    </view>
    
    <view class="content">
      <view v-if="scheduleData.length > 0" class="schedule-list">
        <view v-for="(item, index) in scheduleData" :key="index" class="schedule-item card">
          <view class="schedule-time">
            <text class="time-text">{{ item.time }}</text>
          </view>
          <view class="schedule-detail">
            <text class="course-name">{{ item.course }}</text>
            <text class="class-name">{{ item.class }}</text>
            <text class="room-name">{{ item.room }}</text>
          </view>
        </view>
      </view>
      <EmptyState v-else description="今日暂无排课" />
    </view>
    
    <view class="fab" @tap="uni.showToast({ title: '添加排课功能', icon: 'none' })">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.schedule {
  min-height: 100vh;
  background: $color-bg-page;
}

.week-tabs {
  display: flex;
  background: $color-bg-card;
  padding: $spacing-sm $spacing-md;
  overflow-x: auto;
}

.week-tab {
  flex-shrink: 0;
  padding: $spacing-sm $spacing-md;
  margin: 0 $spacing-xs;
  border-radius: $radius-tag;
  text-align: center;
}

.week-tab.active {
  background: $color-primary;
}

.week-tab.active .week-day {
  color: $color-text-white;
}

.week-day {
  font-size: $font-size-body;
  color: $color-text-secondary;
}

.content {
  padding: $spacing-lg;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.schedule-item {
  display: flex;
  gap: $spacing-lg;
  padding: $spacing-lg;
}

.schedule-time {
  flex-shrink: 0;
  padding-right: $spacing-lg;
  border-right: 2px solid $color-primary;
}

.time-text {
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.schedule-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.course-name {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.class-name,
.room-name {
  font-size: $font-size-body-sm;
  color: $color-text-secondary;
}

.fab {
  position: fixed;
  right: $spacing-lg;
  bottom: 120rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-hover;
}

.fab-icon {
  font-size: 48rpx;
  color: $color-text-white;
  font-weight: $font-weight-bold;
}
</style>
