import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '@/utils/storage'
import { sendCode, verifyCode, bindWechat, getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(storage.get('token', ''))
  const userInfo = ref(storage.get('user', null))
  const accounts = ref(storage.get('accounts', []))
  const currentRole = ref(storage.get('currentRole', 'student'))

  const isLoggedIn = computed(() => !!token.value)
  const isStudent = computed(() => currentRole.value === 'student')
  const isTeacher = computed(() => currentRole.value === 'teacher')
  const isAdmin = computed(() => currentRole.value === 'admin')

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

  const setRole = (role) => {
    currentRole.value = role
    storage.set('currentRole', role)
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
    currentRole,
    isLoggedIn,
    isStudent,
    isTeacher,
    isAdmin,
    setToken,
    setUserInfo,
    setRole,
    doLoginByCode,
    doBindWechat,
    doLogout,
    fetchUserInfo,
    switchAccount,
    updateUserInfo
  }
})
