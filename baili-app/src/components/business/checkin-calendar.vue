<template>
  <view class="bl-checkin-calendar">
    <view class="bl-checkin-calendar__header">
      <view class="bl-checkin-calendar__nav" @click="handlePrev">
        <text>‹</text>
      </view>
      <text class="bl-checkin-calendar__title">{{ year }}年{{ month }}月</text>
      <view class="bl-checkin-calendar__nav" @click="handleNext">
        <text>›</text>
      </view>
    </view>
    <view class="bl-checkin-calendar__weekdays">
      <text v-for="day in weekdays" :key="day" class="bl-checkin-calendar__weekday">{{ day }}</text>
    </view>
    <view class="bl-checkin-calendar__days">
      <view
        v-for="(day, index) in calendarDays"
        :key="index"
        class="bl-checkin-calendar__day"
        :class="{
          'bl-checkin-calendar__day--empty': !day.date,
          'bl-checkin-calendar__day--today': day.isToday,
          'bl-checkin-calendar__day--checked': day.checked
        }"
      >
        <text v-if="day.date">{{ day.date }}</text>
        <view v-if="day.checked" class="bl-checkin-calendar__checkmark">✓</view>
      </view>
    </view>
    <view class="bl-checkin-calendar__stats">
      <view class="bl-checkin-calendar__stat">
        <text class="bl-checkin-calendar__stat-value">{{ checkinDays }}</text>
        <text class="bl-checkin-calendar__stat-label">累计打卡</text>
      </view>
      <view class="bl-checkin-calendar__stat">
        <text class="bl-checkin-calendar__stat-value">{{ continuousDays }}</text>
        <text class="bl-checkin-calendar__stat-label">连续打卡</text>
      </view>
      <view class="bl-checkin-calendar__stat">
        <text class="bl-checkin-calendar__stat-value">{{ monthDays }}</text>
        <text class="bl-checkin-calendar__stat-label">本月打卡</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  checkedDates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['prev', 'next', 'day-click'])

const currentDate = ref(new Date())
const weekdays = ref(['日', '一', '二', '三', '四', '五', '六'])

const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth() + 1)

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(year.value, month.value - 1, 1)
  const lastDay = new Date(year.value, month.value, 0)
  const today = new Date()

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: null, checked: false, isToday: false })
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateStr = `${year.value}-${String(month.value).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    const isToday = today.getFullYear() === year.value &&
                   today.getMonth() === month.value - 1 &&
                   today.getDate() === i
    days.push({
      date: i,
      checked: props.checkedDates.includes(dateStr),
      isToday
    })
  }

  return days
})

const checkinDays = computed(() => props.checkedDates.length)
const continuousDays = computed(() => {
  let count = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    if (props.checkedDates.includes(dateStr)) {
      count++
    } else if (i > 0) {
      break
    }
  }
  return count
})
const monthDays = computed(() => {
  return calendarDays.value.filter(d => d.checked).length
})

const handlePrev = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  emit('prev')
}

const handleNext = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  emit('next')
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.bl-checkin-calendar {
  background: $color-bg-card;
  border-radius: $radius-card;
  padding: $spacing-xl;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $spacing-xl;
  }

  &__nav {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: $color-text-secondary;
  }

  &__title {
    font-size: $font-size-h2;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__weekdays {
    display: flex;
    margin-bottom: $spacing-sm;
  }

  &__weekday {
    flex: 1;
    text-align: center;
    font-size: $font-size-caption;
    color: $color-text-placeholder;
  }

  &__days {
    display: flex;
    flex-wrap: wrap;
  }

  &__day {
    width: 14.28%;
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: $font-size-body;
    color: $color-text-primary;
    position: relative;

    &--empty {
      visibility: hidden;
    }

    &--today {
      color: $color-primary;
      font-weight: $font-weight-semibold;
    }

    &--checked {
      color: $color-text-white;

      &::before {
        content: '';
        position: absolute;
        width: 70%;
        height: 70%;
        background: $color-checkin-gradient;
        border-radius: 50%;
        z-index: 0;
      }

      text {
        position: relative;
        z-index: 1;
      }
    }
  }

  &__checkmark {
    position: absolute;
    bottom: 5rpx;
    right: 5rpx;
    font-size: 16rpx;
    color: $color-text-white;
    z-index: 1;
  }

  &__stats {
    display: flex;
    margin-top: $spacing-xl;
    padding-top: $spacing-xl;
    border-top: 1px solid $color-border-light;
  }

  &__stat {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__stat-value {
    font-size: $font-size-h1;
    font-weight: $font-weight-bold;
    color: $color-primary;
    margin-bottom: $spacing-xs;
  }

  &__stat-label {
    font-size: $font-size-caption;
    color: $color-text-secondary;
  }
}
</style>
