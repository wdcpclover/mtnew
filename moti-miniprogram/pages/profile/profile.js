/**
 * 我的页面
 */

const app = getApp()
const api = require('../../utils/api')

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

    const darkMode = app.globalData.darkMode || false
    this.setData({
      darkMode,
      statusBarHeight: systemInfo.statusBarHeight,
      canGoBack: pages.length > 1
    })

    // 设置系统导航栏颜色
    this.updateNavBarColor(darkMode)

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
    const darkMode = app.globalData.darkMode || false
    this.setData({ darkMode })
    this.updateNavBarColor(darkMode)
  },

  // 更新系统导航栏/胶囊颜色
  updateNavBarColor(darkMode) {
    wx.setNavigationBarColor({
      frontColor: darkMode ? '#ffffff' : '#000000',
      backgroundColor: darkMode ? '#1C1C1C' : '#FFFFFF',
      animation: {
        duration: 200,
        timingFunc: 'easeIn'
      }
    })
  },

  // ============ 数据加载 ============

  async loadUserStats() {
    try {
      // 获取用户统计数据
      const stats = await api.getUserStats()

      this.setData({
        readArticles: stats.readCount || 0,
        totalArticles: stats.totalPosts || 3000,
        progressPercent: stats.totalPosts ?
          ((stats.readCount / stats.totalPosts) * 100).toFixed(1) : 0,
        readingHours: stats.readingTime ? (stats.readingTime / 3600).toFixed(1) : 0,
        readingDays: stats.consecutiveDays || 0
      })
    } catch (err) {
      console.warn('加载用户统计失败:', err)
      // 保留默认值，不影响页面显示
    }
  },

  // ============ 深色模式 ============

  toggleDarkMode(e) {
    const darkMode = e.detail.value
    this.setData({ darkMode })
    app.setDarkMode(darkMode)
    this.updateNavBarColor(darkMode)
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
  },

  // ============ 分享 ============

  onShareAppMessage() {
    return {
      title: 'Moti 之地 - 发现有趣的问答',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    }
  },

  onShareTimeline() {
    return {
      title: 'Moti 之地 - 发现有趣的问答',
      imageUrl: '/images/share-cover.png'
    }
  }
})
