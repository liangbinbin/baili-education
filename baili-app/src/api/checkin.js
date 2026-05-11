import request from './request.js'

export default {
  checkin: {
    stats: () => request({ url: '/api/checkin/stats' })
  }
}

export const getCheckinStats = () => request({ url: '/api/checkin/stats' })
