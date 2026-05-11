<script setup>
import { ref, computed } from 'vue'
import { useTaskStore, useClassStore } from '@/store'

const taskStore = useTaskStore()
const classStore = useClassStore()

const form = ref({
  classId: '',
  title: '',
  type: 'homework',
  startDate: '',
  endDate: '',
  frequency: {
    mode: 'daily_once',
    timesPerDay: 1,
    weekDays: []
  },
  checkinSettings: {
    allowSkip: true,
    allowMakeup: true,
    makeupLimit: 3
  },
  points: {
    submit: 10,
    shareMoment: 5,
    shareSession: 0,
    completion: 50,
    threshold: 0
  },
  shareSettings: {
    enabled: true,
    allowMoment: true,
    allowSession: true
  },
  attachments: {
    required: true,
    types: ['video', 'audio', 'image'],
    maxCount: 3,
    maxSize: 50
  },
  status: 'active'
})

const typeOptions = [
  { label: '作业', value: 'homework' },
  { label: '打卡', value: 'checkin' }
]

const frequencyOptions = [
  { label: '每日一次', value: 'daily_once' },
  { label: '每日多次', value: 'daily_multi' },
  { label: '每周固定', value: 'weekly' }
]

const weekDays = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 7 }
]

const fileTypeOptions = [
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
  { label: '图片', value: 'image' }
]

const isCheckin = computed(() => form.value.type === 'checkin')
const isWeekly = computed(() => form.value.frequency.mode === 'weekly')
const isDailyMulti = computed(() => form.value.frequency.mode === 'daily_multi')

const toggleWeekDay = (day) => {
  const index = form.value.frequency.weekDays.indexOf(day)
  if (index > -1) {
    form.value.frequency.weekDays.splice(index, 1)
  } else {
    form.value.frequency.weekDays.push(day)
  }
}

const toggleFileType = (type) => {
  const index = form.value.attachments.types.indexOf(type)
  if (index > -1) {
    form.value.attachments.types.splice(index, 1)
  } else {
    form.value.attachments.types.push(type)
  }
}

const validateForm = () => {
  if (!form.value.classId) {
    uni.showToast({ title: '请选择班级', icon: 'none' })
    return false
  }
  if (!form.value.title) {
    uni.showToast({ title: '请输入任务标题', icon: 'none' })
    return false
  }
  if (!form.value.startDate) {
    uni.showToast({ title: '请选择开始日期', icon: 'none' })
    return false
  }
  if (!form.value.endDate) {
    uni.showToast({ title: '请选择结束日期', icon: 'none' })
    return false
  }
  if (isWeekly.value && form.value.frequency.weekDays.length === 0) {
    uni.showToast({ title: '请选择星期', icon: 'none' })
    return false
  }
  return true
}

const submit = async (saveAsDraft = false) => {
  if (!validateForm()) return
  
  form.value.status = saveAsDraft ? 'draft' : 'active'
  
  try {
    await taskStore.createTask(form.value)
    uni.showToast({ title: saveAsDraft ? '保存成功' : '发布成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    console.error(e)
  }
}

const saveDraft = () => submit(true)
const publishTask = () => submit(false)
</script>

<template>
  <view class="task-publish">
    <Navbar title="发布任务" />
    
    <scroll-view scroll-y class="content">
      <view class="form-section card">
        <view class="section-title">基本信息</view>
        
        <view class="form-item">
          <text class="form-label">班级</text>
          <picker mode="selector" :range="['演讲基础一班', '演讲进阶二班', '少儿主持三班']" @change="(e) => form.classId = e.detail.value">
            <view class="form-picker">
              <text>{{ form.classId || '请选择班级' }}</text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">任务标题</text>
          <input 
            class="form-input" 
            v-model="form.title" 
            placeholder="请输入任务标题"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">任务类型</text>
          <view class="type-options">
            <view 
              v-for="item in typeOptions" 
              :key="item.value"
              class="type-option"
              :class="{ active: form.type === item.value }"
              @tap="form.type = item.value"
            >
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="form-section card">
        <view class="section-title">时间设置</view>
        
        <view class="form-row">
          <view class="form-item flex-1">
            <text class="form-label">开始日期</text>
            <picker mode="date" @change="(e) => form.startDate = e.detail.value">
              <view class="form-picker">
                <text>{{ form.startDate || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
          </view>
          <view class="form-item flex-1 ml-lg">
            <text class="form-label">结束日期</text>
            <picker mode="date" @change="(e) => form.endDate = e.detail.value">
              <view class="form-picker">
                <text>{{ form.endDate || '请选择' }}</text>
                <text class="picker-arrow">›</text>
              </view>
            </picker>
          </view>
        </view>
      </view>
      
      <view class="form-section card">
        <view class="section-title">频次模式</view>
        
        <view class="form-item">
          <view class="frequency-options">
            <view 
              v-for="item in frequencyOptions" 
              :key="item.value"
              class="frequency-option"
              :class="{ active: form.frequency.mode === item.value }"
              @tap="form.frequency.mode = item.value"
            >
              <view class="radio">
                <view v-if="form.frequency.mode === item.value" class="radio-dot"></view>
              </view>
              <text class="radio-label">{{ item.label }}</text>
            </view>
          </view>
        </view>
        
        <view v-if="isDailyMulti" class="form-item">
          <text class="form-label">每日次数</text>
          <input 
            class="form-input" 
            type="number"
            v-model="form.frequency.timesPerDay" 
            placeholder="请输入次数"
          />
        </view>
        
        <view v-if="isWeekly" class="form-item">
          <text class="form-label">选择的星期</text>
          <view class="week-days">
            <view 
              v-for="day in weekDays" 
              :key="day.value"
              class="week-day"
              :class="{ active: form.frequency.weekDays.includes(day.value) }"
              @tap="toggleWeekDay(day.value)"
            >
              <text>{{ day.label }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view v-if="isCheckin" class="form-section card">
        <view class="section-title">打卡设置</view>
        
        <view class="form-item">
          <view class="switch-item" @tap="form.checkinSettings.allowSkip = !form.checkinSettings.allowSkip">
            <text class="form-label">允许跳过</text>
            <view class="switch" :class="{ active: form.checkinSettings.allowSkip }">
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <view class="switch-item" @tap="form.checkinSettings.allowMakeup = !form.checkinSettings.allowMakeup">
            <text class="form-label">允许补打卡</text>
            <view class="switch" :class="{ active: form.checkinSettings.allowMakeup }">
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>
        
        <view v-if="form.checkinSettings.allowMakeup" class="form-item">
          <text class="form-label">补打卡次数限制</text>
          <input 
            class="form-input" 
            type="number"
            v-model="form.checkinSettings.makeupLimit" 
            placeholder="请输入次数"
          />
        </view>
      </view>
      
      <view class="form-section card">
        <view class="section-title">积分设置</view>
        
        <view class="form-item">
          <text class="form-label">每次提交</text>
          <input 
            class="form-input" 
            type="number"
            v-model="form.points.submit" 
            placeholder="积分"
          />
        </view>
        
        <view v-if="isCheckin" class="form-item">
          <text class="form-label">朋友圈分享</text>
          <input 
            class="form-input" 
            type="number"
            v-model="form.points.shareMoment" 
            placeholder="积分"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">完成奖励</text>
          <input 
            class="form-input" 
            type="number"
            v-model="form.points.completion" 
            placeholder="积分"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">奖励条件</text>
          <picker mode="selector" :range="['全部完成', '完成10次', '完成20次']" @change="(e) => form.points.threshold = e.detail.value === 0 ? 0 : (e.detail.value === 1 ? 10 : 20)">
            <view class="form-picker">
              <text>{{ form.points.threshold === 0 ? '全部完成' : form.points.threshold + '次' }}</text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
      </view>
      
      <view class="form-section card">
        <view class="section-title">分享设置</view>
        
        <view class="form-item">
          <view class="switch-item" @tap="form.shareSettings.enabled = !form.shareSettings.enabled">
            <text class="form-label">启用分享功能</text>
            <view class="switch" :class="{ active: form.shareSettings.enabled }">
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>
        
        <view v-if="form.shareSettings.enabled && isCheckin" class="form-item">
          <view class="switch-item" @tap="form.shareSettings.allowMoment = !form.shareSettings.allowMoment">
            <text class="form-label">允许朋友圈</text>
            <view class="switch" :class="{ active: form.shareSettings.allowMoment }">
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>
        
        <view v-if="form.shareSettings.enabled" class="form-item">
          <view class="switch-item" @tap="form.shareSettings.allowSession = !form.shareSettings.allowSession">
            <text class="form-label">允许微信聊天</text>
            <view class="switch" :class="{ active: form.shareSettings.allowSession }">
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="form-section card">
        <view class="section-title">附件要求</view>
        
        <view class="form-item">
          <view class="switch-item" @tap="form.attachments.required = !form.attachments.required">
            <text class="form-label">必须上传附件</text>
            <view class="switch" :class="{ active: form.attachments.required }">
              <view class="switch-dot"></view>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">可上传类型</text>
          <view class="file-types">
            <view 
              v-for="item in fileTypeOptions" 
              :key="item.value"
              class="file-type"
              :class="{ active: form.attachments.types.includes(item.value) }"
              @tap="toggleFileType(item.value)"
            >
              <text>{{ item.label }}</text>
            </view>
          </view>
        </view>
        
        <view class="form-item">
          <text class="form-label">最多上传</text>
          <input 
            class="form-input" 
            type="number"
            v-model="form.attachments.maxCount" 
            placeholder="个数"
          />
        </view>
        
        <view class="form-item">
          <text class="form-label">单文件大小</text>
          <input 
            class="form-input" 
            type="number"
            v-model="form.attachments.maxSize" 
            placeholder="MB"
          />
        </view>
      </view>
      
      <view class="footer-padding"></view>
    </scroll-view>
    
    <view class="footer">
      <Button class="footer-btn" @tap="saveDraft">保存草稿</Button>
      <Button type="primary" class="footer-btn" @tap="publishTask">发布任务</Button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.task-publish {
  min-height: 100vh;
  background: $color-bg-page;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: $spacing-lg;
  overflow-y: auto;
}

.form-section {
  padding: $spacing-lg;
  margin-bottom: $spacing-md;
}

.section-title {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
  margin-bottom: $spacing-md;
}

.form-row {
  display: flex;
  gap: $spacing-md;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  padding: $spacing-md 0;
  border-bottom: 1px solid $color-border-light;
}

.form-item:last-child {
  border-bottom: none;
}

.flex-1 {
  flex: 1;
}

.ml-lg {
  margin-left: $spacing-lg;
}

.form-label {
  font-size: $font-size-body;
  font-weight: $font-weight-medium;
  color: $color-text-primary;
}

.form-input,
.form-picker {
  height: 80rpx;
  line-height: 80rpx;
  font-size: $font-size-body;
  color: $color-text-primary;
  background: $color-bg-page;
  border-radius: $radius-sm;
  padding: 0 $spacing-md;
}

.form-picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-arrow {
  color: $color-text-placeholder;
  font-size: $font-size-h2;
}

.type-options {
  display: flex;
  gap: $spacing-md;
}

.type-option {
  flex: 1;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid $color-border;
  border-radius: $radius-sm;
  font-size: $font-size-body;
  color: $color-text-secondary;
}

.type-option.active {
  border-color: $color-primary;
  color: $color-primary;
  background: rgba($color-primary, 0.05);
}

.frequency-options {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.frequency-option {
  display: flex;
  align-items: center;
  gap: $spacing-md;
}

.radio {
  width: 40rpx;
  height: 40rpx;
  border: 2px solid $color-border;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-dot {
  width: 24rpx;
  height: 24rpx;
  background: $color-primary;
  border-radius: 50%;
}

.frequency-option.active .radio {
  border-color: $color-primary;
}

.radio-label {
  font-size: $font-size-body;
  color: $color-text-primary;
}

.week-days {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.week-day {
  width: 80rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  font-size: $font-size-body-sm;
  color: $color-text-secondary;
}

.week-day.active {
  border-color: $color-primary;
  background: $color-primary;
  color: $color-text-white;
}

.switch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  width: 88rpx;
  height: 48rpx;
  background: $color-border;
  border-radius: 24rpx;
  padding: 4rpx;
  transition: all 0.3s;
}

.switch.active {
  background: $color-primary;
}

.switch-dot {
  width: 40rpx;
  height: 40rpx;
  background: $color-text-white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.switch.active .switch-dot {
  transform: translateX(40rpx);
}

.file-types {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.file-type {
  padding: $spacing-sm $spacing-md;
  border: 1px solid $color-border;
  border-radius: $radius-sm;
  font-size: $font-size-body-sm;
  color: $color-text-secondary;
}

.file-type.active {
  border-color: $color-primary;
  background: $color-primary;
  color: $color-text-white;
}

.footer-padding {
  height: 160rpx;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: $spacing-md;
  padding: $spacing-md $spacing-lg;
  padding-bottom: calc($spacing-md + env(safe-area-inset-bottom));
  background: $color-bg-card;
  border-top: 1px solid $color-border-light;
}

.footer-btn {
  flex: 1;
}
</style>
