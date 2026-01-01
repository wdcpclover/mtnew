const app = getApp()

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: systemInfo.statusBarHeight
    })
  },

  goBack() {
    wx.navigateBack()
  },

  openPrivacy() {
    wx.showToast({ title: '隐私协议', icon: 'none' })
  },

  openTerms() {
    wx.showToast({ title: '服务条款', icon: 'none' })
  }
})
