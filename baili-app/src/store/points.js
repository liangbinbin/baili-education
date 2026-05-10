import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getPointsBalance,
  getPointsRecords,
  getPointsRanking,
  getPointsRules,
  addPoints,
  exchangePoints
} from '@/api/points'

export const usePointsStore = defineStore('points', () => {
  const balance = ref(0)
  const records = ref([])
  const ranking = ref([])
  const rules = ref([])
  const loading = ref(false)

  const fetchBalance = async () => {
    loading.value = true
    try {
      const res = await getPointsBalance()
      balance.value = res.data.balance || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const fetchRecords = async (params = {}) => {
    loading.value = true
    try {
      const res = await getPointsRecords(params)
      records.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const fetchRanking = async (params = {}) => {
    loading.value = true
    try {
      const res = await getPointsRanking(params)
      ranking.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const fetchRules = async () => {
    loading.value = true
    try {
      const res = await getPointsRules()
      rules.value = res.data.list || res.data
      return res
    } finally {
      loading.value = false
    }
  }

  const doAddPoints = async (data) => {
    const res = await addPoints(data)
    return res
  }

  const doExchangePoints = async (data) => {
    const res = await exchangePoints(data)
    return res
  }

  return {
    balance,
    records,
    ranking,
    rules,
    loading,
    fetchBalance,
    fetchRecords,
    fetchRanking,
    fetchRules,
    doAddPoints,
    doExchangePoints
  }
})
