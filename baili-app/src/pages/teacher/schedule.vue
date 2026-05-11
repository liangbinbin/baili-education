<script setup>
import { ref, onMounted, computed } from 'vue'
import { useScheduleStore } from '@/store'

const scheduleStore = useScheduleStore()
const currentTab = ref('week')
const currentDate = ref(new Date())

const tabs = [
  { key: 'week', label: '本周' },
  { key: 'next', label: '下周' },
  { key: 'month', label: '本月' }
]

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const timeSlots = ['08:00-09:30', '09:00-10:30', '10:00-11:30', '14:00-15:30', '15:00-16:30', '16:00-17:30']

// 模拟数据
const scheduleData = ref([
  {
    day: 0, // 周一
    timeIndex: 1, // 09:00-10:30
    courseName: '演讲基础',
    className: '启蒙A班',
    room: '1号教室',
    teacher: '李老师',
    studentCount: 12
  },
  {
    day: 2, // 周三
    timeIndex: 3, // 14:00-15:30
    courseName: '演讲进阶',
    className: '进阶B班',
    room: '2号教室',
    teacher: '王老师',
    studentCount: 15
  },
  {
    day: 4, // 周五
    timeIndex: 4, // 15:00-16:30
    courseName: '少儿主持',
    className: '主持C班',
    room: '3号教室',
    teacher: '张老师',
    studentCount: 10
  }
])

const getScheduleByDayAndTime = (dayIndex, timeIndex) => {
  return scheduleData.value.find(s => s.day === dayIndex && s.timeIndex === timeIndex)
}

const tabChange = (key) => {
  currentTab.value = key
}

const addSchedule = () => {
  uni.showToast({
    title: '添加排课功能',
    icon: 'none'
  })
}

const viewDetail = (schedule) => {
  uni.showToast({
    title: `${schedule.courseName} - ${schedule.className}`,
    icon: 'none'
  })
}

onMounted(async () => {
  await scheduleStore.fetchScheduleList()
})
</script>

<template>
  <view class="schedule">
    <view class="header">
      <text class="title">我的课表</text>
      <view class="add-btn" @tap="addSchedule">
        <text class="add-icon">+</text>
      </view>
    </view>
    
    <Tabs :tabs="tabs" :current="currentTab" @change="tabChange" />
    
    <scroll-view scroll-x class="table-container">
      <view class="table">
        <!-- 时间列 -->
        <view class="time-column">
          <view class="cell header-cell">时间</view>
          <view 
            v-for="(time, idx) in timeSlots" 
            :key="idx" 
            class="cell time-cell"
          >
            <text class="time-text">{{ time }}</text>
          </view>
        </view>
        
        <!-- 星期列 -->
        <view 
          v-for="(day, dayIdx) in weekDays" 
          :key="dayIdx" 
          class="day-column"
        >
          <view class="cell header-cell">
            <text class="day-text">{{ day }}</text>
          </view>
          <view 
            v-for="(time, timeIdx) in timeSlots" 
            :key="timeIdx" 
            class="cell content-cell"
            :class="{ hasClass: getScheduleByDayAndTime(dayIdx, timeIdx) }"
            @tap="getScheduleByDayAndTime(dayIdx, timeIdx) && viewDetail(getScheduleByDayAndTime(dayIdx, timeIdx))"
          >
            <view v-if="getScheduleByDayAndTime(dayIdx, timeIdx)" class="class-card">
              <text class="class-name">{{ getScheduleByDayAndTime(dayIdx, timeIdx).courseName }}</text>
              <text class="class-info">{{ getScheduleByDayAndTime(dayIdx, timeIdx).className }}</text>
              <text class="class-room">{{ getScheduleByDayAndTime(dayIdx, timeIdx).room }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    
    <view class="legend">
      <view class="legend-item">
        <view class="legend-color filled"></view>
        <text class="legend-text">有课</text>
      </view>
      <view class="legend-item">
        <view class="legend-color empty"></view>
        <text class="legend-text">空闲</text>
      </view>
    </view>
    
    <view class="quick-list">
      <view class="list-header">
        <text class="list-title">今日课程</text>
      </view>
      <view class="list-content">
        <view 
          v-if="scheduleData.filter(s => s.day === new Date().getDay() - 1).length > 0"
          v-for="item in scheduleData.filter(s => s.day === new Date().getDay() - 1)" 
          :key="item.courseName" 
          class="list-item card"
          @tap="viewDetail(item)"
        >
          <view class="item-time">
            <text class="time">{{ timeSlots[item.timeIndex] }}</text>
          </view>
          <view class="item-info">
            <text class="item-course">{{ item.courseName }}</text>
            <text class="item-class">{{ item.className }}</text>
            <text class="item-room">{{ item.room }}</text>
          </view>
          <view class="item-arrow">›</view>
        </view>
        <EmptyState v-else description="今日无课程" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.schedule {
  min-height: 100vh;
  background: $color-bg-page;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg;
  padding-top: 100rpx;
  background: $color-bg-card;
}

.title {
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
}

.add-btn {
  width: 64rpx;
  height: 64rpx;
  background: $color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 36rpx;
  color: $color-text-white;
  font-weight: bold;
}

.table-container {
  margin: $spacing-md;
  white-space: nowrap;
}

.table {
  display: inline-flex;
  background: $color-bg-card;
  border-radius: $radius-card;
  overflow: hidden;
}

.time-column,
.day-column {
  display: flex;
  flex-direction: column;
  min-width: 140rpx;
}

.day-column {
  min-width: 160rpx;
}

.cell {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid $color-border-light;
  border-right: 1px solid $color-border-light;
  padding: $spacing-xs;
}

.header-cell {
  height: 80rpx;
  background: $color-primary-light;
  font-weight: $font-weight-semibold;
  color: $color-primary;
  font-size: $font-size-body;
}

.time-cell {
  background: $color-bg-page;
}

.time-text {
  font-size: $font-size-caption;
  color: $color-text-secondary;
  text-align: center;
}

.day-text {
  font-size: $font-size-body;
}

.content-cell {
  position: relative;
}

.content-cell.hasClass {
  background: $color-primary-light;
}

.class-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4rpx;
  padding: 8rpx;
  border-radius: $radius-sm;
  background: $color-primary;
}

.class-name {
  font-size: $font-size-body-sm;
  font-weight: $font-weight-semibold;
  color: $color-text-white;
  text-align: center;
}

.class-info,
.class-room {
  font-size: $font-size-mini;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

.legend {
  display: flex;
  justify-content: center;
  gap: $spacing-xl;
  padding: $spacing-md 0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
}

.legend-color {
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;
}

.legend-color.filled {
  background: $color-primary;
}

.legend-color.empty {
  background: $color-bg-card;
  border: 1px solid $color-border;
}

.legend-text {
  font-size: $font-size-caption;
  color: $color-text-secondary;
}

.quick-list {
  padding: $spacing-lg;
}

.list-header {
  margin-bottom: $spacing-md;
}

.list-title {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.list-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
}

.item-time {
  flex-shrink: 0;
  padding: $spacing-sm $spacing-md;
  background: $color-primary-light;
  border-radius: $radius-sm;
}

.time {
  font-size: $font-size-body-sm;
  font-weight: $font-weight-semibold;
  color: $color-primary;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.item-course {
  font-size: $font-size-body;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.item-class,
.item-room {
  font-size: $font-size-body-sm;
  color: $color-text-secondary;
}

.item-arrow {
  font-size: 36rpx;
  color: $color-text-placeholder;
}
</style>
