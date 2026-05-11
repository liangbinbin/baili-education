import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/points'

export const usePointsStore = defineStore('points', () => {
  // 状态
  const stats = ref({
    currentPoints: 0,
    totalEarned: 0,
    totalSpent: 0,
    weekRecords: []
  })
  const records = ref([])
  const ranking = ref({
    myRank: null,
    topThree: [],
    list: []
  })
  const rules = ref([])
  const loading = ref(false)
  const rankingType = ref('week')
  const rankingScope = ref('class')

  // 计算属性
  const currentPoints = computed(() => stats.value.currentPoints)

  // 方法
  const fetchStats = async () => {
    loading.value = true
    try {
      const res = await api.my()
      stats.value = res.data
    } catch (error) {
      uni.showToast({ title: '获取积分失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  const fetchRecords = async (params = {}) => {
    loading.value = true
    try {
      const res = await api.records(params)
      records.value = res.data.list || res.data
    } catch (error) {
      uni.showToast({ title: '获取积分记录失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  const fetchRanking = async (params = {}) => {
    loading.value = true
    try {
      const res = await api.ranking({
        type: rankingType.value,
        scope: rankingScope.value,
        ...params
      })
      ranking.value = res.data
    } catch (error) {
      uni.showToast({ title: '获取排行榜失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  const fetchRules = async () => {
    loading.value = true
    try {
      const res = await api.rules()
      rules.value = res.data.list || res.data
    } catch (error) {
      uni.showToast({ title: '获取积分规则失败', icon: 'none' })
    } finally {
      loading.value = false
    }
  }

  const setRankingType = (type) => {
    rankingType.value = type
    fetchRanking()
  }

  const setRankingScope = (scope) => {
    rankingScope.value = scope
    fetchRanking()
  }

  const doShareReward = async (data) => {
    try {
      const res = await api.shareReward(data)
      await fetchStats()
      return res
    } catch (error) {
      // 静默处理
    }
  }

  return {
    // 状态
    stats,
    records,
    ranking,
    rules,
    loading,
    rankingType,
    rankingScope,
    // 计算属性
    currentPoints,
    // 方法
    fetchStats,
    fetchRecords,
    fetchRanking,
    fetchRules,
    setRankingType,
    setRankingScope,
    doShareReward
  }
})
