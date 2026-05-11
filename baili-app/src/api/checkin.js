import request from './request.js'

// 模拟打卡统计数据
const mockCheckinStats = {
  total: 45,
  streak: 7,
  maxStreak: 14,
  today: 1,
  shareStats: {
    totalChatShares: 23,
    totalMomentsShares: 15,
    momentsPointsEarned: 75,
    completionBonusEarned: 200
  }
}

export default {
  checkin: {
    stats: () => Promise.resolve(mockCheckinStats)
  }
}

export const getCheckinStats = () => Promise.resolve(mockCheckinStats)
