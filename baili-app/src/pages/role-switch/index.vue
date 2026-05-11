<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { onMounted } from 'vue'

const userStore = useUserStore()
const currentRole = ref(userStore.currentRole)

const roles = [
  {
    id: 'student',
    name: '学员端',
    description: '完成作业、打卡练习、查看积分',
    icon: '👶'
  },
  {
    id: 'teacher',
    name: '教师端',
    description: '管理任务、批改作业、排课管理',
    icon: '👨‍🏫'
  }
]

const selectRole = (roleId) => {
  userStore.setRole(roleId)
  
  // 跳转到对应角色的首页
  if (roleId === 'student') {
    uni.switchTab({
      url: '/pages/student/home'
    })
  } else if (roleId === 'teacher') {
    uni.switchTab({
      url: '/pages/teacher/home'
    })
  }
}

onMounted(() => {
  currentRole.value = userStore.currentRole
})
</script>

<template>
  <view class="role-switch">
    <view class="header">
      <text class="title">选择角色</text>
      <text class="subtitle">请选择您要使用的角色</text>
    </view>
    
    <view class="role-list">
      <view 
        v-for="role in roles" 
        :key="role.id"
        class="role-item card"
        :class="{ active: currentRole === role.id }"
        @tap="selectRole(role.id)"
      >
        <view class="role-icon">
          <text>{{ role.icon }}</text>
        </view>
        <view class="role-info">
          <text class="role-name">{{ role.name }}</text>
          <text class="role-desc">{{ role.description }}</text>
        </view>
        <view v-if="currentRole === role.id" class="role-check">
          <text>✓</text>
        </view>
      </view>
    </view>
    
    <view class="footer">
      <text class="footer-text">点击角色即可切换</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.role-switch {
  min-height: 100vh;
  background: $color-bg-page;
  padding: $spacing-xl $spacing-lg;
  display: flex;
  flex-direction: column;
}

.header {
  margin-bottom: $spacing-xl;
  padding-top: 100rpx;
}

.title {
  display: block;
  font-size: $font-size-h1;
  font-weight: $font-weight-bold;
  color: $color-text-primary;
  margin-bottom: $spacing-sm;
}

.subtitle {
  display: block;
  font-size: $font-size-body;
  color: $color-text-secondary;
}

.role-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.role-item {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  position: relative;
  transition: all 0.3s;
}

.role-item.active {
  border: 2px solid $color-primary;
  box-shadow: $shadow-card;
}

.role-icon {
  width: 100rpx;
  height: 100rpx;
  background: $color-primary-light;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48rpx;
  flex-shrink: 0;
}

.role-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $spacing-xs;
}

.role-name {
  font-size: $font-size-h3;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.role-desc {
  font-size: $font-size-body-sm;
  color: $color-text-secondary;
}

.role-check {
  width: 48rpx;
  height: 48rpx;
  background: $color-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $color-text-white;
  font-size: 28rpx;
  font-weight: bold;
}

.footer {
  text-align: center;
  padding: $spacing-lg 0;
}

.footer-text {
  font-size: $font-size-caption;
  color: $color-text-placeholder;
}
</style>
