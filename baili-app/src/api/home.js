import { get } from './request'

export const getHomeOverview = () => {
  // 返回模拟数据，避免 API 调用失败
  return Promise.resolve({
    points: 850,
    checkinDays: 7,
    pendingHomework: 3,
    completedHomework: 12,
    totalCheckin: 45
  })
}

export default {
  getHomeOverview
}
