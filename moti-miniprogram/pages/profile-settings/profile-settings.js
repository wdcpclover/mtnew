const app = getApp()

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    notificationEnabled: true
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const userInfo = app.globalData.userInfo || app.globalData.mockUser
    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: systemInfo.statusBarHeight,
      notificationEnabled: userInfo.isNotificationEnabled
    })
  },

  goBack() {
    wx.navigateBack()
  },

  toggleNotification(e) {
    this.setData({ notificationEnabled: e.detail.value })
  },

  toggleDarkMode(e) {
    const isDark = e.detail.value
    this.setData({ darkMode: isDark })
    app.setDarkMode(isDark)
  },

  contactService() {
    wx.showToast({ title: '客服功能开发中', icon: 'none' })
  }
})
