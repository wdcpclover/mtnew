const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    userInfo: null,
    loading: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: systemInfo.statusBarHeight,
      userInfo: app.globalData.userInfo
    })

    this.loadUserProfile()
  },

  // 加载用户资料
  async loadUserProfile() {
    this.setData({ loading: true })

    try {
      const profile = await api.getUserProfile()
      this.setData({ userInfo: profile })
    } catch (err) {
      console.error('加载用户资料失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  goBack() {
    wx.navigateBack()
  },

  // 更新头像
  async updateAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        // TODO: 上传头像到服务器
        wx.showToast({
          title: '头像更新功能开发中',
          icon: 'none'
        })
      }
    })
  },

  // 更新昵称
  updateNickname() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称',
      success: async (res) => {
        if (res.confirm && res.content) {
          wx.showLoading({ title: '更新中...' })
          try {
            await api.updateUserProfile({ nickname: res.content })
            this.setData({ 'userInfo.nickname': res.content })
            app.globalData.userInfo.nickname = res.content
            wx.hideLoading()
            wx.showToast({ title: '更新成功', icon: 'success' })
          } catch (err) {
            wx.hideLoading()
            wx.showToast({ title: err.message || '更新失败', icon: 'none' })
          }
        }
      }
    })
  },

  // 更新签名
  updateSignature() {
    wx.showModal({
      title: '修改签名',
      editable: true,
      placeholderText: '请输入新签名',
      success: async (res) => {
        if (res.confirm && res.content) {
          wx.showLoading({ title: '更新中...' })
          try {
            await api.updateUserProfile({ signature: res.content })
            this.setData({ 'userInfo.signature': res.content })
            if (app.globalData.userInfo) {
              app.globalData.userInfo.signature = res.content
            }
            wx.hideLoading()
            wx.showToast({ title: '更新成功', icon: 'success' })
          } catch (err) {
            wx.hideLoading()
            wx.showToast({ title: err.message || '更新失败', icon: 'none' })
          }
        }
      }
    })
  },

  // 打开编辑弹窗
  openEditModal() {
    wx.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    })
  }
})
