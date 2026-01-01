const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    stats: null,
    points: null,
    loading: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: systemInfo.statusBarHeight
    })

    this.loadData()
  },

  // 加载数据
  async loadData() {
    this.setData({ loading: true })

    try {
      const [stats, points] = await Promise.all([
        api.getUserStats().catch(() => null),
        api.getPoints().catch(() => null)
      ])

      this.setData({
        stats: stats,
        points: points
      })
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 签到
  async handleCheckin() {
    wx.showLoading({ title: '签到中...', mask: true })

    try {
      const result = await api.checkin()
      wx.hideLoading()
      wx.showToast({
        title: `签到成功 +${result.points || 10}积分`,
        icon: 'success'
      })

      // 刷新积分
      this.loadData()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '签到失败',
        icon: 'none'
      })
    }
  },

  goBack() {
    wx.navigateBack()
  }
})
