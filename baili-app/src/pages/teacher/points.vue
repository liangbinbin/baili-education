<script setup>
import { ref, onMounted } from 'vue'
import { usePointsStore } from '@/store'

const pointsStore = usePointsStore()
const currentTab = ref('records')
const tabs = [
  { key: 'records', label: '积分记录' },
  { key: 'rules', label: '积分规则' }
]

onMounted(async () => {
  await pointsStore.fetchPointsRecords()
  await pointsStore.fetchPointsRules()
})
</script>

<template>
  <view class="teacher-points">
    <Navbar title="积分管理" />
    
    <Tabs :tabs="tabs" :current="currentTab" @change="currentTab = $event" />
    
    <view class="content">
      <view v-if="currentTab === 'records'" class="records-section">
        <view v-if="pointsStore.pointsRecords.length > 0" class="points-list">
          <PointsRecord 
            v-for="record in pointsStore.pointsRecords" 
            :key="record.id" 
            :record="record"
          />
        </view>
        <EmptyState v-else description="暂无积分记录" />
      </view>
      
      <view v-else class="rules-section">
        <PointsRule :rules="pointsStore.pointsRules" />
      </view>
    </view>
    
    <view class="fab" @tap="uni.showToast({ title: '调整积分功能', icon: 'none' })">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.teacher-points {
  min-height: 100vh;
  background: $color-bg-page;
}

.content {
  padding: $spacing-lg;
}

.points-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
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
