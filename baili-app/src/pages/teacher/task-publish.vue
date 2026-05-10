<script setup>
import { ref } from 'vue'
import { useTaskStore } from '@/store'

const taskStore = useTaskStore()

const form = ref({
  title: '',
  type: 'homework',
  classId: '',
  content: '',
  startDate: '',
  endDate: '',
  points: 10,
  frequency: {
    mode: 'daily',
    times: 1
  }
})

const typeOptions = [
  { label: '作业', value: 'homework' },
  { label: '打卡', value: 'checkin' }
]

const frequencyOptions = [
  { label: '每日一次', value: 'daily' },
  { label: '每日多次', value: 'daily_multi' },
  { label: '每周固定', value: 'weekly' }
]

const submit = async () => {
  if (!form.value.title) {
    uni.showToast({ title: '请输入任务标题', icon: 'none' })
    return
  }
  
  try {
    await taskStore.createTask(form.value)
    uni.showToast({ title: '发布成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <view class="task-publish">
    <Navbar title="发布任务" />
    
    <view class="content">
      <view class="form-section card">
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
          <picker mode="selector" :range="typeOptions" range-key="label" @change="(e) => form.type = typeOptions[e.detail.value].value">
            <view class="form-picker">
              <text>{{ typeOptions.find(o => o.value === form.type)?.label || '请选择' }}</text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">关联班级</text>
          <picker mode="selector" :range="['班级A', '班级B']" @change="">
            <view class="form-picker">
              <text>{{ form.classId || '请选择班级' }}</text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">任务内容</text>
          <textarea 
            class="form-textarea" 
            v-model="form.content" 
            placeholder="请输入任务内容"
            :maxlength="500"
          />
        </view>
        
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
        
        <view class="form-item">
          <text class="form-label">频次模式</text>
          <picker mode="selector" :range="frequencyOptions" range-key="label" @change="(e) => form.frequency.mode = frequencyOptions[e.detail.value].value">
            <view class="form-picker">
              <text>{{ frequencyOptions.find(o => o.value === form.frequency.mode)?.label || '请选择' }}</text>
              <text class="picker-arrow">›</text>
            </view>
          </picker>
        </view>
        
        <view class="form-item">
          <text class="form-label">积分设置</text>
          <input 
            class="form-input" 
            v-model="form.points" 
            type="number"
            placeholder="请输入积分"
          />
        </view>
      </view>
      
      <view class="footer">
        <Button type="primary" block @tap="submit">发布任务</Button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.task-publish {
  min-height: 100vh;
  background: $color-bg-page;
}

.content {
  padding: $spacing-lg;
  padding-bottom: 120rpx;
}

.form-section {
  padding: $spacing-lg;
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

.form-textarea {
  min-height: 200rpx;
  font-size: $font-size-body;
  color: $color-text-primary;
  background: $color-bg-page;
  border-radius: $radius-sm;
  padding: $spacing-md;
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

.footer {
  margin-top: $spacing-xl;
}
</style>
