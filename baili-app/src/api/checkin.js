import { get } from './request'

export const getCheckinStats = (params) =&gt; {
  return get('/checkin/stats', params)
}

export const getCheckinCalendar = (year, month) =&gt; {
  return get('/checkin/calendar', { year, month })
}

export const getCheckinRanking = (params) =&gt; {
  return get('/checkin/ranking', params)
}

export default {
  getCheckinStats,
  getCheckinCalendar,
  getCheckinRanking
}
