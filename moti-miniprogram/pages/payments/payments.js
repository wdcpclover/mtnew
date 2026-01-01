const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    navBarHeight: 0,
    productStatus: 'active',
    productStatusText: '已激活',
    expireDate: '2026-06-31',
    redeemCode: '',
    paymentList: [],
    loading: true
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const statusBarHeight = systemInfo.statusBarHeight
    const navBarHeight = statusBarHeight + 44

    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: statusBarHeight,
      navBarHeight: navBarHeight
    })

    this.loadPaymentData()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode
    })
  },

  // 加载付款数据
  async loadPaymentData() {
    this.setData({ loading: true })

    try {
      if (api.getPaymentRecords) {
        const result = await api.getPaymentRecords()
        this.setData({
          productStatus: result.productStatus || 'active',
          productStatusText: result.productStatus === 'active' ? '已激活' : '未激活',
          expireDate: result.expireDate || '2026-06-31',
          paymentList: result.payments || [],
          loading: false
        })
      } else {
        this.loadMockData()
      }
    } catch (err) {
      console.error('加载付款记录失败:', err)
      this.loadMockData()
    }
  },

  // 加载模拟数据
  loadMockData() {
    const mockPayments = [
      { id: 1, name: '月会员', date: '2026-06-31', amount: 99 },
      { id: 2, name: '月会员', date: '2026-06-31', amount: 99 }
    ]

    this.setData({
      productStatus: 'active',
      productStatusText: '已激活',
      expireDate: '2026-06-31',
      paymentList: mockPayments,
      loading: false
    })
  },

  // 返回
  goBack() {
    wx.navigateBack()
  },

  // 兑换码输入
  onRedeemInput(e) {
    this.setData({
      redeemCode: e.detail.value
    })
  },

  // 提交兑换
  async submitRedeem() {
    const { redeemCode } = this.data

    if (!redeemCode.trim()) {
      wx.showToast({ title: '请输入兑换码', icon: 'none' })
      return
    }

    wx.showLoading({ title: '兑换中...', mask: true })

    try {
      if (api.redeemCode) {
        const result = await api.redeemCode(redeemCode)
        wx.hideLoading()

        if (result.success) {
          wx.showToast({ title: '兑换成功', icon: 'success' })
          this.setData({ redeemCode: '' })
          // 刷新数据
          this.loadPaymentData()
        } else {
          wx.showToast({ title: result.message || '兑换失败', icon: 'none' })
        }
      } else {
        // 模拟兑换
        wx.hideLoading()
        wx.showToast({ title: '兑换码无效', icon: 'none' })
      }
    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '兑换失败', icon: 'none' })
    }
  }
})
