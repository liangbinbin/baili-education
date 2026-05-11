import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api/points'

export const usePointsStore = defineStore('points', () => {
  const stats = ref({
    current: 0,
    totalEarned: 0,
    totalDeducted: 0
  })
  const records = ref([])
  const recordsPagination = ref(null)
  const ranking = ref({
    period: 'week',
    periodText: '本周榜',
    list: [],
    myRank: null,
    pagination: null
  })
  const loading = ref(false)
  const rankingPeriod = ref('week')
  const rankingScope = ref('class')

  const currentPoints = computed(() => stats.value.current)

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
      records.value = res.data.list || []
      recordsPagination.value = res.data.pagination || null
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
        period: rankingPeriod.value,
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

  const setRankingPeriod = (period) => {
    rankingPeriod.value = period
    fetchRanking()
  }

  const setRankingScope = (scope) => {
    rankingScope.value = scope
    fetchRanking()
  }

  return {
    stats,
    records,
    recordsPagination,
    ranking,
    loading,
    rankingPeriod,
    rankingScope,
    currentPoints,
    fetchStats,
    fetchRecords,
    fetchRanking,
    setRankingPeriod,
    setRankingScope
  }
})
