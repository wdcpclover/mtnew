/**
 * API 请求封装
 */

const config = require('./config');

/**
 * 获取存储的 Token
 */
function getToken() {
  return wx.getStorageSync(config.TOKEN_KEY) || '';
}

/**
 * 设置 Token
 */
function setToken(token) {
  wx.setStorageSync(config.TOKEN_KEY, token);
}

/**
 * 清除 Token
 */
function clearToken() {
  wx.removeStorageSync(config.TOKEN_KEY);
}

/**
 * 获取存储的用户信息
 */
function getUser() {
  return wx.getStorageSync(config.USER_KEY) || null;
}

/**
 * 设置用户信息
 */
function setUser(user) {
  wx.setStorageSync(config.USER_KEY, user);
}

/**
 * 清除用户信息
 */
function clearUser() {
  wx.removeStorageSync(config.USER_KEY);
}

/**
 * 基础请求封装
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const token = getToken();

    const header = {
      'Content-Type': 'application/json',
      ...options.header
    };

    // 如果有 token，添加到请求头
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: config.API_BASE + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: header,
      timeout: config.TIMEOUT,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.success) {
            resolve(res.data.data);
          } else {
            reject(new Error(res.data.error || '请求失败'));
          }
        } else if (res.statusCode === 401) {
          // Token 过期，清除登录状态（不强制跳转，允许游客浏览）
          clearToken();
          clearUser();
          reject(new Error('需要登录'));
        } else if (res.statusCode === 403) {
          reject(new Error(res.data.error || '没有权限'));
        } else {
          reject(new Error(res.data.error || `请求失败: ${res.statusCode}`));
        }
      },
      fail: (err) => {
        console.error('请求失败:', config.API_BASE + options.url, err);
        reject(new Error('网络请求失败: ' + (err.errMsg || JSON.stringify(err))));
      }
    });
  });
}

// ==================== 认证相关 API ====================

/**
 * 微信登录
 * @param {string} code - wx.login 获取的 code
 * @param {object} userInfo - 用户信息 (可选)
 */
function wechatLogin(code, userInfo = null) {
  return request({
    url: '/auth/wechat',
    method: 'POST',
    data: { code, userInfo }
  });
}

/**
 * 用户名密码登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 */
function login(username, password) {
  return request({
    url: '/auth/login',
    method: 'POST',
    data: { username, password }
  });
}

/**
 * 刷新 Token
 */
function refreshToken() {
  return request({
    url: '/auth/refresh',
    method: 'POST'
  });
}

/**
 * 退出登录
 */
function logout() {
  const token = getToken();
  // 没有 token 时直接清除本地状态
  if (!token) {
    clearToken();
    clearUser();
    return Promise.resolve();
  }
  return request({
    url: '/auth/logout',
    method: 'POST'
  }).finally(() => {
    clearToken();
    clearUser();
  });
}

/**
 * 绑定手机号
 * @param {string} code - 手机号授权 code
 */
function bindPhone(code) {
  return request({
    url: '/auth/bindPhone',
    method: 'POST',
    data: { code }
  });
}

// ==================== 用户相关 API ====================

/**
 * 获取用户资料
 */
function getUserProfile() {
  return request({
    url: '/user/profile',
    method: 'GET'
  });
}

/**
 * 更新用户资料
 */
function updateUserProfile(data) {
  return request({
    url: '/user/profile',
    method: 'PUT',
    data: data
  });
}

/**
 * 获取用户收藏列表
 */
function getUserBookmarks(page = 1, limit = config.PAGE_SIZE) {
  return request({
    url: `/user/bookmarks?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

/**
 * 获取用户点赞列表
 */
function getUserUpvotes(page = 1, limit = config.PAGE_SIZE) {
  return request({
    url: `/user/upvotes?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

/**
 * 获取用户发布的帖子
 */
function getUserPosts(page = 1, limit = config.PAGE_SIZE) {
  return request({
    url: `/user/posts?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

/**
 * 获取用户统计数据
 */
function getUserStats() {
  return request({
    url: '/user/stats',
    method: 'GET'
  });
}

/**
 * 获取用户发布的主题
 */
function getUserTopics(page = 1, limit = config.PAGE_SIZE) {
  return request({
    url: `/user/topics?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

// ==================== 内容相关 API ====================

/**
 * 获取帖子列表
 * @param {object} params - 查询参数
 */
function getPosts(params = {}) {
  const { page = 1, limit = config.PAGE_SIZE, sort = 'recent' } = params;
  return request({
    url: `/posts?page=${page}&limit=${limit}&sort=${sort}`,
    method: 'GET'
  });
}

/**
 * 获取帖子详情
 * @param {number} pid - 帖子 ID
 */
function getPostDetail(pid) {
  return request({
    url: `/post/${pid}`,
    method: 'GET'
  });
}

/**
 * 搜索帖子
 * @param {string} query - 搜索关键词
 * @param {object} params - 其他参数
 */
function searchPosts(query, params = {}) {
  const { page = 1, limit = config.PAGE_SIZE } = params;
  return request({
    url: `/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

/**
 * 获取分类列表
 */
function getCategories() {
  return request({
    url: '/categories',
    method: 'GET'
  });
}

/**
 * 获取分类下的主题
 * @param {number} cid - 分类 ID
 * @param {object} params - 查询参数
 */
function getCategoryTopics(cid, params = {}) {
  const { page = 1, limit = config.PAGE_SIZE } = params;
  return request({
    url: `/category/${cid}/topics?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

/**
 * 获取标签列表
 */
function getTags() {
  return request({
    url: '/tags',
    method: 'GET'
  });
}

/**
 * 获取未读帖子数
 */
function getUnreadCount() {
  return request({
    url: '/unread',
    method: 'GET'
  });
}

// ==================== 互动相关 API ====================

/**
 * 点赞/取消点赞帖子
 * @param {number} pid - 帖子 ID
 */
function toggleUpvote(pid) {
  return request({
    url: `/post/${pid}/upvote`,
    method: 'POST'
  });
}

/**
 * 收藏/取消收藏帖子
 * @param {number} pid - 帖子 ID
 */
function toggleBookmark(pid) {
  return request({
    url: `/post/${pid}/bookmark`,
    method: 'POST'
  });
}

/**
 * 发表评论
 * @param {number} pid - 帖子 ID
 * @param {string} content - 评论内容
 */
function addComment(pid, content) {
  return request({
    url: `/post/${pid}/comment`,
    method: 'POST',
    data: { content }
  });
}

/**
 * 获取帖子评论
 * @param {number} pid - 帖子 ID
 * @param {object} params - 查询参数
 */
function getComments(pid, params = {}) {
  const { page = 1, limit = config.PAGE_SIZE } = params;
  return request({
    url: `/post/${pid}/comments?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

// ==================== 笔记相关 API ====================

/**
 * 保存笔记
 * @param {object} noteData - 笔记数据
 */
function saveNote(noteData) {
  return request({
    url: '/notes',
    method: 'POST',
    data: noteData
  });
}

/**
 * 获取帖子的笔记
 * @param {number} pid - 帖子 ID
 */
function getPostNotes(pid) {
  return request({
    url: `/post/${pid}/notes`,
    method: 'GET'
  });
}

/**
 * 删除笔记
 * @param {number} noteId - 笔记 ID
 */
function deleteNote(noteId) {
  return request({
    url: `/note/${noteId}`,
    method: 'DELETE'
  });
}

// ==================== 积分相关 API ====================

/**
 * 获取积分信息
 */
function getPoints() {
  return request({
    url: '/points',
    method: 'GET'
  });
}

/**
 * 签到
 */
function checkin() {
  return request({
    url: '/points/checkin',
    method: 'POST'
  });
}

/**
 * 获取积分排行榜
 */
function getPointsRanking(limit = 20) {
  return request({
    url: `/points/ranking?limit=${limit}`,
    method: 'GET'
  });
}

/**
 * 获取积分历史
 */
function getPointsHistory(page = 1, limit = config.PAGE_SIZE) {
  return request({
    url: `/points/history?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

// ==================== VIP/支付相关 API ====================

/**
 * 获取 VIP 产品列表
 */
function getVIPProducts() {
  return request({
    url: '/vip/products',
    method: 'GET'
  });
}

/**
 * 获取 VIP 状态
 */
function getVIPStatus() {
  return request({
    url: '/vip/status',
    method: 'GET'
  });
}

/**
 * 创建订单
 * @param {string} productId - 产品 ID
 */
function createOrder(productId) {
  return request({
    url: '/order/create',
    method: 'POST',
    data: { productId }
  });
}

/**
 * 获取订单列表
 */
function getOrders(page = 1, limit = config.PAGE_SIZE) {
  return request({
    url: `/orders?page=${page}&limit=${limit}`,
    method: 'GET'
  });
}

/**
 * 兑换码兑换
 * @param {string} code - 兑换码
 */
function redeemCode(code) {
  return request({
    url: '/redeem',
    method: 'POST',
    data: { code }
  });
}

// ==================== 发布相关 API ====================

/**
 * 发布主题/帖子
 * @param {object} data - 帖子数据
 */
function createTopic(data) {
  return request({
    url: '/topic',
    method: 'POST',
    data: data
  });
}

module.exports = {
  // Token 管理
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,

  // 认证
  login,
  wechatLogin,
  refreshToken,
  logout,
  bindPhone,

  // 用户
  getUserProfile,
  updateUserProfile,
  getUserBookmarks,
  getUserUpvotes,
  getUserPosts,
  getUserStats,
  getUserTopics,

  // 内容
  getPosts,
  getPostDetail,
  searchPosts,
  getCategories,
  getCategoryTopics,
  getTags,
  getUnreadCount,

  // 互动
  toggleUpvote,
  toggleBookmark,
  addComment,
  getComments,

  // 笔记
  saveNote,
  getPostNotes,
  deleteNote,

  // 积分
  getPoints,
  checkin,
  getPointsRanking,
  getPointsHistory,

  // VIP/支付
  getVIPProducts,
  getVIPStatus,
  createOrder,
  getOrders,
  redeemCode,

  // 发布
  createTopic
};
