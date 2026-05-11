import request from './request'

export const getMyPoints = () => {
  return request({
    url: '/api/points/my',
    method: 'GET'
  })
}

export const getPointsRecords = (params) => {
  return request({
    url: '/api/points/records',
    method: 'GET',
    data: params
  })
}

export const getPointsRanking = (params) => {
  return request({
    url: '/api/points/ranking',
    method: 'GET',
    data: params
  })
}

export const getPointsRules = () => {
  return request({
    url: '/api/points/rules',
    method: 'GET'
  })
}

export const shareReward = (data) => {
  return request({
    url: '/api/points/share-reward',
    method: 'POST',
    data
  })
}

export default {
  my: getMyPoints,
  records: getPointsRecords,
  ranking: getPointsRanking,
  rules: getPointsRules,
  shareReward
}
