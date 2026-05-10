import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'
import { login, logout, getSmsCode, loginByCode, getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(storage.get('token', ''))
  const userInfo = ref(storage.get('user', null))

  const isLoggedIn = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    storage.set('token', newToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    storage.set('user', info)
  }

  const doLogin = async (data) => {
    const res = await login(data)
    setToken(res.data.token)
    setUserInfo(res.data.user)
    return res
  }

  const doLoginByCode = async (phone, code) => {
    const res = await loginByCode(phone, code)
    setToken(res.data.token)
    setUserInfo(res.data.user)
    return res
  }

  const doLogout = async () => {
    await logout()
    token.value = ''
    userInfo.value = null
    storage.remove('token')
    storage.remove('user')
  }

  const fetchUserInfo = async () => {
    const res = await getUserInfo()
    setUserInfo(res.data)
    return res
  }

  const updateUserInfo = (info) => {
    setUserInfo({ ...userInfo.value, ...info })
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    doLogin,
    doLoginByCode,
    doLogout,
    fetchUserInfo,
    updateUserInfo
  }
})
