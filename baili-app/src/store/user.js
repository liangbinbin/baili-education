import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'
import { sendCode, verifyCode, bindWechat, getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(storage.get('token', ''))
  const userInfo = ref(storage.get('user', null))
  const accounts = ref(storage.get('accounts', []))

  const isLoggedIn = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    storage.set('token', newToken)
  }

  const setUserInfo = (info) => {
    userInfo.value = info
    storage.set('user', info)
    
    // 保存到账户列表
    if (info) {
      const existingAccountIndex = accounts.value.findIndex(a => a.id === info.id)
      if (existingAccountIndex >= 0) {
        accounts.value[existingAccountIndex] = info
      } else {
        accounts.value.push(info)
      }
      storage.set('accounts', accounts.value)
    }
  }

  const doLoginByCode = async (phone, code) => {
    const res = await verifyCode(phone, code)
    setToken(res.token)
    setUserInfo(res.user)
    return res
  }

  const doBindWechat = async (code) => {
    const res = await bindWechat(code)
    return res
  }

  const doLogout = async () => {
    token.value = ''
    userInfo.value = null
    storage.remove('token')
    storage.remove('user')
  }

  const fetchUserInfo = async () => {
    const res = await getUserInfo()
    setUserInfo(res)
    return res
  }

  const switchAccount = async (account) => {
    // 切换账户逻辑
    setUserInfo(account)
    // 可以在这里重新获取 token 等
  }

  const updateUserInfo = (info) => {
    setUserInfo({ ...userInfo.value, ...info })
  }

  return {
    token,
    userInfo,
    accounts,
    isLoggedIn,
    setToken,
    setUserInfo,
    doLoginByCode,
    doBindWechat,
    doLogout,
    fetchUserInfo,
    switchAccount,
    updateUserInfo
  }
})
