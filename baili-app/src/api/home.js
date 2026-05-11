import { get } from './request'

export const getHomeOverview = () => {
  return get('/home/overview')
}

export default {
  getHomeOverview
}
