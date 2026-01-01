const api = require('./utils/api')
const config = require('./utils/config')

App({
  globalData: {
    userInfo: null,
    isLoggedIn: false,
    darkMode: false,
    systemInfo: null,
    statusBarHeight: 0,
    navBarHeight: 44,
    menuButtonInfo: null
  },

  onLaunch() {
    // 检查登录状态
    const token = api.getToken()
    const userInfo = api.getUser()

    if (token && userInfo) {
      this.globalData.isLoggedIn = true
      this.globalData.userInfo = userInfo
      // 验证 token 有效性
      this.validateToken()
    }

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo
    this.globalData.statusBarHeight = systemInfo.statusBarHeight
    this.globalData.navBarHeight = 44
    this.globalData.menuButtonInfo = wx.getMenuButtonBoundingClientRect()

    // 获取深色模式设置
    const darkMode = wx.getStorageSync('darkMode')
    this.globalData.darkMode = darkMode || false
  },

  // 验证 Token 有效性
  validateToken() {
    api.getUserProfile()
      .then(user => {
        // Token 有效，更新用户信息
        this.globalData.userInfo = user
        api.setUser(user)
      })
      .catch(err => {
        console.log('Token 验证失败:', err)
        // Token 无效，清除登录状态
        this.logout()
      })
  },

  // 设置深色模式
  setDarkMode(isDark) {
    this.globalData.darkMode = isDark
    wx.setStorageSync('darkMode', isDark)
  },

  // 微信登录
  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(new Error('获取登录凭证失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  // 登录 (使用后端返回的数据)
  login(token, userInfo) {
    api.setToken(token)
    api.setUser(userInfo)
    this.globalData.isLoggedIn = true
    this.globalData.userInfo = userInfo
  },

  // 退出登录
  logout() {
    api.logout().catch(() => {})  // 忽略退出登录的错误
    api.clearToken()
    api.clearUser()
    this.globalData.isLoggedIn = false
    this.globalData.userInfo = null
  },

  // 检查是否已登录
  checkLogin() {
    return this.globalData.isLoggedIn && api.getToken()
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo
  }
})
