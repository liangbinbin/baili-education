import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('adminToken') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('adminUserInfo') || '{}'))

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('adminToken', newToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    localStorage.setItem('adminUserInfo', JSON.stringify(info))
  }

  const logout = () => {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUserInfo')
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout
  }
})
