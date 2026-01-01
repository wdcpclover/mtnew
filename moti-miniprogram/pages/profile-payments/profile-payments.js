const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    vipStatus: null,
    redeemCode: '',
    orders: [],
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
      const [vipStatus, orders] = await Promise.all([
        api.getVIPStatus().catch(() => null),
        api.getOrders().catch(() => [])
      ])

      this.setData({
        vipStatus: vipStatus,
        orders: orders.orders || orders || []
      })
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  goBack() {
    wx.navigateBack()
  },

  onRedeemInput(e) {
    this.setData({ redeemCode: e.detail.value })
  },

  // 兑换码兑换
  async handleRedeem() {
    const code = this.data.redeemCode.trim()

    if (!code) {
      wx.showToast({ title: '请输入兑换码', icon: 'none' })
      return
    }

    wx.showLoading({ title: '兑换中...', mask: true })

    try {
      const result = await api.redeemCode(code)
      wx.hideLoading()
      wx.showToast({
        title: result.message || '兑换成功',
        icon: 'success'
      })

      this.setData({ redeemCode: '' })
      // 刷新数据
      this.loadData()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: err.message || '兑换失败',
        icon: 'none'
      })
    }
  },

  // 开通 VIP
  async openVIP() {
    wx.navigateTo({
      url: '/pages/vip/vip'
    })
  }
})
