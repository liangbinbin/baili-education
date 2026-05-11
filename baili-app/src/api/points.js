import request from './request'

export const getMyPoints = () => {
  return request({ url: '/api/points/my' })
}

export const getPointsRecords = (params) => {
  return request({ url: '/api/points/records', method: 'GET', data: params })
}

export const getPointsRanking = (params) => {
  return request({ url: '/api/points/ranking', method: 'GET', data: params })
}

export const adjustPoints = (data) => {
  return request({ url: '/api/points/adjust', method: 'POST', data })
}

export default {
  my: getMyPoints,
  records: getPointsRecords,
  ranking: getPointsRanking,
  adjust: adjustPoints
}
