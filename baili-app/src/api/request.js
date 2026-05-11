import storage from '@/utils/storage.js';

const BASE_URL = '';

function request(options) {
  return new Promise((resolve, reject) => {
    const token = storage.get('token');
    
    uni.showLoading({ title: '加载中...', mask: true });
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: (res) => {
        uni.hideLoading();
        
        if (res.statusCode === 200) {
          const data = res.data;
          
          // Token 过期
          if (data.code === 401) {
            storage.remove('token');
            uni.reLaunch({ url: '/pages/login/index' });
            reject(new Error('登录已过期'));
            return;
          }
          
          if (data.code === 200) {
            resolve(data.data);
          } else {
            uni.showToast({ title: data.message || '请求失败', icon: 'none' });
            reject(new Error(data.message));
          }
        } else {
          uni.showToast({ title: '网络错误', icon: 'none' });
          reject(new Error('网络错误'));
        }
      },
      fail: (err) => {
        uni.hideLoading();
        uni.showToast({ title: '请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

// 导出常用方法
const get = (url, data) => request({ url, method: 'GET', data });
const post = (url, data) => request({ url, method: 'POST', data });
const put = (url, data) => request({ url, method: 'PUT', data });
const del = (url, data) => request({ url, method: 'DELETE', data });

export { request, get, post, put, del };
export default request;
