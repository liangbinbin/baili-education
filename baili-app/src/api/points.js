import request from './request'

// 模拟积分数据
const mockPointsData = {
  total: 850,
  week: 120,
  today: 15,
  history: [
    { id: '1', type: 'checkin', title: '完成打卡', points: 10, date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { id: '2', type: 'share', title: '分享到朋友圈', points: 5, date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: '3', type: 'homework', title: '完成作业', points: 20, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: '4', type: 'completion', title: '完成任务', points: 50, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() }
  ]
}

// 模拟排行榜数据
const mockRankingData = [
  { rank: 1, name: '小红同学', points: 2850, avatar: '' },
  { rank: 2, name: '小明同学', points: 2100, avatar: '' },
  { rank: 3, name: '小华同学', points: 1890, avatar: '' },
  { rank: 4, name: '小李同学', points: 1650, avatar: '' },
  { rank: 5, name: '小王同学', points: 1420, avatar: '' }
]

export const getMyPoints = () => Promise.resolve(mockPointsData)

export const getPointsRecords = (params) => Promise.resolve({ list: mockPointsData.history, pagination: { page: 1, pageSize: 10, total: 4, totalPages: 1 } })

export const getPointsRanking = (params) => Promise.resolve({ list: mockRankingData })

export const adjustPoints = (data) => Promise.resolve({ success: true })

export default {
  my: getMyPoints,
  records: getPointsRecords,
  ranking: getPointsRanking,
  adjust: adjustPoints
}
