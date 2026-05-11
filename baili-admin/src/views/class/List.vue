<template>
  <div class="class-list">
    <el-card>
      <template #header>
        <div class="card-header">
        <span>班级列表</span>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增班级
        </el-button>
      </div>
    </template>
    
    <el-table :data="classList" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="班级名称" />
      <el-table-column prop="courseName" label="所属课程" />
      <el-table-column prop="teacherName" label="授课教师" />
      <el-table-column prop="studentCount" label="学员数" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '进行中' : '已结束' }}
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

const classList = ref([
  { id: 1, name: '启蒙A班', courseName: '演讲基础', teacherName: '李老师', studentCount: 15, status: 'active' },
  { id: 2, name: '进阶B班', courseName: '演讲进阶', teacherName: '王老师', studentCount: 12, status: 'active' },
  { id: 3, name: '主持C班', courseName: '少儿口才', teacherName: '张老师', studentCount: 18, status: 'active' }
])

const handleAdd = () => {
  ElMessage.info('新增功能开发中')
}

const handleEdit = (row) => {
  ElMessage.info('编辑功能开发中')
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该班级吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
  })
}
</script>

<style lang="scss" scoped>
.class-list {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
  }
}
</style>