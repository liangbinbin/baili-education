import { post } from './request'

// 模拟数据
const mockUsers = {
  '13800138000': { id: 1, name: '小明同学', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar&image_size=square', points: 850 },
  '13800138001': { id: 2, name: '小红同学', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20girl%20avatar&image_size=square', points: 1200 },
  '13800138002': { id: 3, name: '测试学员', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20kid%20avatar&image_size=square', points: 500 }
}

// 发送验证码
export const sendCode = (phone) => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true })
    }, 500)
  })
}

// 验证码登录
export const verifyCode = (phone, code) => {
  // 模拟API调用 - 任何6位验证码都可以登录
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers[phone]) {
        resolve({
          token: 'mock_token_' + Date.now(),
          user: mockUsers[phone]
        })
      } else {
        // 如果是新手机号，创建一个新用户
        resolve({
          token: 'mock_token_' + Date.now(),
          user: {
            id: Math.floor(Math.random() * 1000),
            name: '新学员',
            avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20child%20avatar&image_size=square',
            points: 0
          }
        })
      }
    }, 500)
  })
}

// 微信绑定
export const bindWechat = (code) => {
  return post('/api/auth/wx-bind', { code })
}

// 获取用户信息
export const getUserInfo = () => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: '小明同学',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20cartoon%20boy%20avatar&image_size=square',
        points: 850
      })
    }, 300)
  })
}

export default {
  sendCode,
  verifyCode,
  bindWechat,
  getUserInfo
}
