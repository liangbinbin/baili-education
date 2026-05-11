<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon student">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">156</div>
              <div class="stat-label">学员总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon teacher">
              <el-icon><School /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">24</div>
              <div class="stat-label">教师总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon course">
              <el-icon><Reading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">36</div>
              <div class="stat-label">课程总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon class">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">48</div>
              <div class="stat-label">班级总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>近期任务</span>
            </div>
          </template>
          <el-table :data="recentTasks" style="width: 100%">
            <el-table-column prop="title" label="任务名称" />
            <el-table-column prop="type" label="类型">
              <template #default="{ row }">
                <el-tag :type="row.type === 'homework' ? 'primary' : 'success'">
                  {{ row.type === 'homework' ? '作业' : '打卡' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="className" label="班级" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.status === 'active' ? 'success' : 'warning'">
                  {{ row.status === 'active' ? '进行中' : '草稿' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="创建时间" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" style="width: 100%; margin-bottom: 12px;">
              <el-icon><Plus /></el-icon>
              新增课程
            </el-button>
            <el-button style="width: 100%; margin-bottom: 12px;">
              <el-icon><Plus /></el-icon>
              新增班级
            </el-button>
            <el-button type="success" style="width: 100%;">
              <el-icon><Calendar /></el-icon>
              排课管理
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const recentTasks = ref([
  { title: '演讲基础练习', type: 'homework', className: '启蒙A班', status: 'active', date: '2024-01-15' },
  { title: '每日打卡', type: 'checkin', className: '进阶B班', status: 'active', date: '2024-01-14' },
  { title: '口部操训练', type: 'homework', className: '主持C班', status: 'draft', date: '2024-01-13' },
  { title: '朗诵练习', type: 'checkin', className: '启蒙A班', status: 'active', date: '2024-01-12' }
])
</script>

<style lang="scss" scoped>
.dashboard {
  .stat-cards {
    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: white;
          
          &.student {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          &.teacher {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          
          &.course {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }
          
          &.class {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
        }
        
        .stat-info {
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #333;
          }
          
          .stat-label {
            font-size: 14px;
            color: #666;
          }
        }
      }
    }
  }
  
  .card-header {
    font-size: 16px;
    font-weight: bold;
  }
  
  .quick-actions {
    padding: 8px 0;
  }
}
</style>