import { post } from './request'

// 发送验证码
export const sendCode = (phone) => {
  return post('/api/auth/send-code', { phone })
}

// 验证码登录
export const verifyCode = (phone, code) => {
  return post('/api/auth/verify-code', { phone, code })
}

// 微信绑定
export const bindWechat = (code) => {
  return post('/api/auth/wx-bind', { code })
}

// 获取用户信息
export const getUserInfo = () => {
  return post('/api/auth/user-info')
}

export default {
  sendCode,
  verifyCode,
  bindWechat,
  getUserInfo
}
