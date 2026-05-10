import { get, post } from './request'

export const getPointsBalance = () => {
  return get('/points/balance')
}

export const getPointsRecords = (params) => {
  return get('/points/records', params)
}

export const getPointsRanking = (params) => {
  return get('/points/ranking', params)
}

export const getPointsRules = () => {
  return get('/points/rules')
}

export const addPoints = (data) => {
  return post('/points/add', data)
}

export const exchangePoints = (data) => {
  return post('/points/exchange', data)
}

export default {
  getPointsBalance,
  getPointsRecords,
  getPointsRanking,
  getPointsRules,
  addPoints,
  exchangePoints
}
