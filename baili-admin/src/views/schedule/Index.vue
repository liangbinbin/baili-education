<template>
  <div class="schedule-page">
    <el-card>
      <template #header>
        <div class="card-header">
        <span>排课管理</span>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          添加排课
        </el-button>
      </div>
    </template>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="班级排课" name="class">
        <div class="schedule-content">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-card class="week-selector">
                <div v-for="(day, index) in weekDays" :key="index" class="day-item" :class="{ active: currentDay === index }" @click="currentDay = index">
                  <div class="day-name">{{ day }}</div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="18">
              <el-card>
                <div class="schedule-day-title">
                  {{ weekDays[currentDay] }} 课程安排
                </div>
                <div class="schedule-list">
                  <div v-for="(item, index) in currentDaySchedule" :key="index" class="schedule-item">
                    <div class="schedule-time">{{ item.time }}</div>
                    <div class="schedule-info">
                      <div class="info-name">{{ item.className }}</div>
                      <div class="info-detail">
                        <span><el-icon><Reading /></el-icon> {{ item.courseName }}</span>
                        <span><el-icon><School /></el-icon> {{ item.teacherName }}</span>
                        <span><el-icon><Location /></el-icon> {{ item.classroom }}</span>
                      </div>
                    </div>
                    <div class="schedule-actions">
                      <el-button size="small" @click="handleEditSchedule(item)">编辑</el-button>
                      <el-button size="small" type="danger" @click="handleDeleteSchedule(item)">删除</el-button>
                    </div>
                  </div>
                  <el-empty v-if="currentDaySchedule.length === 0" description="暂无排课" />
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="教师课表" name="teacher">
        <el-card>
          <el-select v-model="selectedTeacher" placeholder="选择教师" style="width: 200px; margin-bottom: 20px;">
            <el-option label="李老师" value="1" />
            <el-option label="王老师" value="2" />
            <el-option label="张老师" value="3" />
          </el-select>
          <el-table :data="teacherSchedule" style="width: 100%">
            <el-table-column prop="day" label="星期" />
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="className" label="班级" />
            <el-table-column prop="courseName" label="课程" />
            <el-table-column prop="classroom" label="教室" />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('class')
const currentDay = ref(0)
const selectedTeacher = ref('1')
const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const scheduleData = ref([
  { day: 0, time: '09:00-10:30', className: '启蒙A班', courseName: '演讲基础', teacherName: '李老师', classroom: '101教室' },
  { day: 0, time: '14:00-15:30', className: '进阶B班', courseName: '演讲进阶', teacherName: '王老师', classroom: '102教室' },
  { day: 2, time: '10:00-11:30', className: '主持C班', courseName: '少儿口才', teacherName: '张老师', classroom: '103教室' },
  { day: 4, time: '09:00-10:30', className: '启蒙A班', courseName: '演讲基础', teacherName: '李老师', classroom: '101教室' }
])

const currentDaySchedule = computed(() => {
  return scheduleData.value.filter(item => item.day === currentDay.value)
})

const teacherSchedule = ref([
  { day: '周一', time: '09:00-10:30', className: '启蒙A班', courseName: '演讲基础', classroom: '101教室' },
  { day: '周三', time: '10:00-11:30', className: '进阶B班', courseName: '演讲进阶', classroom: '102教室' },
  { day: '周五', time: '09:00-10:30', className: '启蒙A班', courseName: '演讲基础', classroom: '101教室' }
])

const handleAdd = () => {
  ElMessage.info('添加排课功能开发中')
}

const handleEditSchedule = (row) => {
  ElMessage.info('编辑排课功能开发中')
}

const handleDeleteSchedule = (row) => {
  ElMessageBox.confirm('确定要删除该排课吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style lang="scss" scoped>
.schedule-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
  }
  
  .week-selector {
    .day-item {
      padding: 16px;
      text-align: center;
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 8px;
      background: #f5f7fa;
      transition: all 0.3s;
      
      &.active {
        background: #FF6B35;
        color: white;
      }
      
      .day-name {
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
  
  .schedule-day-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }
  
  .schedule-list {
    .schedule-item {
      display: flex;
      align-items: center;
      padding: 16px;
      background: #f5f7fa;
      border-radius: 8px;
      margin-bottom: 12px;
      
      .schedule-time {
        width: 140px;
        font-size: 16px;
        font-weight: bold;
        color: #FF6B35;
      }
      
      .schedule-info {
        flex: 1;
        
        .info-name {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }
        
        .info-detail {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: #666;
          
          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
      
      .schedule-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>