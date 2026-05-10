import { post } from './request'
import { storage } from '@/utils/storage'

export const login = (data) => {
  return post('/auth/login', data).then(res => {
    storage.set('token', res.data.token)
    storage.set('user', res.data.user)
    return res
  })
}

export const logout = () => {
  return post('/auth/logout').then(res => {
    storage.remove('token')
    storage.remove('user')
    return res
  })
}

export const getSmsCode = (phone) => {
  return post('/auth/sms-code', { phone })
}

export const loginByCode = (phone, code) => {
  return post('/auth/login-by-code', { phone, code }).then(res => {
    storage.set('token', res.data.token)
    storage.set('user', res.data.user)
    return res
  })
}

export const bindWechat = (code) => {
  return post('/auth/bind-wechat', { code })
}

export const getUserInfo = () => {
  return post('/auth/user-info')
}

export default {
  login,
  logout,
  getSmsCode,
  loginByCode,
  bindWechat,
  getUserInfo
}
