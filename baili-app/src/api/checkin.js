import { get, post } from './request'

export const getCheckinStats = (params) => {
  return get('/checkin/stats', params)
}

export const getCheckinCalendar = (year, month) => {
  return get('/checkin/calendar', { year, month })
}

export const checkin = () => {
  return post('/checkin')
}

export const getCheckinRanking = (params) => {
  return get('/checkin/ranking', params)
}

export default {
  getCheckinStats,
  getCheckinCalendar,
  checkin,
  getCheckinRanking
}
