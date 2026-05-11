<template>
  <div class="teacher-list">
    <el-card>
      <template #header>
        <div class="card-header">
        <span>教师列表</span>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增教师
        </el-button>
      </div>
    </template>
    
    <el-table :data="teacherList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column prop="courses" label="教授课程" />
      <el-table-column prop="studentCount" label="学员数" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const teacherList = ref([
  { id: 1, name: '李老师', phone: '13900139001', courses: '演讲基础、朗诵', studentCount: 45, status: 'active' },
  { id: 2, name: '王老师', phone: '13900139002', courses: '主持、少儿口才', studentCount: 36, status: 'active' },
  { id: 3, name: '张老师', phone: '13900139003', courses: '演讲进阶', studentCount: 28, status: 'active' }
])

const handleAdd = () => {
  ElMessage.info('新增功能开发中')
}

const handleEdit = (row) => {
  ElMessage.info('编辑功能开发中')
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该教师吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style lang="scss" scoped>
.teacher-list {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>