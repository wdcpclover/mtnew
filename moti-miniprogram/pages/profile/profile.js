/**
 * 我的页面
 */

const app = getApp()

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    canGoBack: false,

    // 用户信息
    userAvatar: '',
    userName: '莫提',
    unreadCount: 12,

    // 阅读统计
    readArticles: 220,
    totalArticles: 3000,
    progressPercent: 7.3,
    readingHours: 110.2,
    readingDays: 30
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const pages = getCurrentPages()

    this.setData({
      darkMode: app.globalData.darkMode || false,
      statusBarHeight: systemInfo.statusBarHeight,
      canGoBack: pages.length > 1
    })

    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userAvatar: app.globalData.userInfo.avatarUrl,
        userName: app.globalData.userInfo.nickName || app.globalData.userInfo.username
      })
    }

    this.loadUserStats()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode || false
    })
  },

  // ============ 数据加载 ============

  async loadUserStats() {
    // TODO: 从 API 获取真实数据
    // const stats = await api.getUserStats()
    // this.setData({
    //   readArticles: stats.readArticles,
    //   totalArticles: stats.totalArticles,
    //   progressPercent: (stats.readArticles / stats.totalArticles * 100).toFixed(1),
    //   readingHours: stats.readingHours,
    //   readingDays: stats.readingDays
    // })
  },

  // ============ 深色模式 ============

  toggleDarkMode(e) {
    const darkMode = e.detail.value
    this.setData({ darkMode })
    app.setDarkMode(darkMode)
  },

  // ============ 导航 ============

  handleBack() {
    wx.navigateBack({
      fail: () => wx.switchTab({ url: '/pages/index/index' })
    })
  },

  goToHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goToTopics() {
    wx.switchTab({ url: '/pages/topics/topics' })
  },

  goToAsk() {
    wx.switchTab({ url: '/pages/community/community' })
  },

  goToEditProfile() {
    wx.navigateTo({ url: '/pages/profile-info/profile-info' })
  },

  goToMembership() {
    wx.navigateTo({ url: '/pages/membership/membership' })
  },

  goToFavorites() {
    wx.navigateTo({ url: '/pages/favorites/favorites' })
  },

  goToMessages() {
    wx.navigateTo({ url: '/pages/messages/messages' })
  },

  goToHistory() {
    wx.navigateTo({ url: '/pages/history/history' })
  },

  goToPayments() {
    wx.navigateTo({ url: '/pages/payments/payments' })
  },

  goToSettings() {
    wx.navigateTo({ url: '/pages/profile-settings/profile-settings' })
  }
})
