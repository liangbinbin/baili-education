const STORAGE_PREFIX = 'baili_'

export const storage = {
  set(key, value) {
    try {
      uni.setStorageSync(STORAGE_PREFIX + key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Storage set error:', e)
      return false
    }
  },

  get(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(STORAGE_PREFIX + key)
      return value ? JSON.parse(value) : defaultValue
    } catch (e) {
      console.error('Storage get error:', e)
      return defaultValue
    }
  },

  remove(key) {
    try {
      uni.removeStorageSync(STORAGE_PREFIX + key)
      return true
    } catch (e) {
      console.error('Storage remove error:', e)
      return false
    }
  },

  clear() {
    try {
      const info = uni.getStorageInfoSync()
      info.keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          uni.removeStorageSync(key)
        }
      })
      return true
    } catch (e) {
      console.error('Storage clear error:', e)
      return false
    }
  }
}

export default storage
