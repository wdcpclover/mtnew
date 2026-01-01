const app = getApp()

Page({
  data: {
    darkMode: false
  },

  onLoad() {
    this.setData({
      darkMode: app.globalData.darkMode
    })

    // 1.8秒后跳转到授权页或主页
    setTimeout(() => {
      if (app.globalData.isLoggedIn) {
        // 已登录，跳转到主页
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        // 未登录，跳转到授权页
        wx.redirectTo({
          url: '/pages/auth/auth'
        })
      }
    }, 1800)
  }
})
