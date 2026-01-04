const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    isEditMode: false,
    favorites: [],
    loading: true
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()

    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: systemInfo.statusBarHeight
    })

    this.loadFavorites()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode
    })
    // 每次显示时刷新收藏列表
    this.loadFavorites()
  },

  // 加载收藏列表
  async loadFavorites() {
    this.setData({ loading: true })

    try {
      // 调用真实 API
      const result = await api.getUserBookmarks(1, 100)
      const favorites = result.posts || result.bookmarks || result || []

      this.setData({
        favorites: favorites.map(item => ({
          id: item.pid || item.id,
          title: item.title || item.titleRaw,
          isHot: item.votes > 10 || item.viewcount > 100
        })),
        loading: false
      })
    } catch (err) {
      console.error('加载收藏失败:', err)
      wx.showToast({ title: err.message || '加载失败', icon: 'none' })
      this.setData({ favorites: [], loading: false })
    }
  },


  // 返回
  goBack() {
    wx.navigateBack()
  },

  // 显示更多选项
  showMore() {
    wx.showActionSheet({
      itemList: ['清空全部收藏', '导出收藏列表'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.clearAllFavorites()
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '功能开发中', icon: 'none' })
        }
      }
    })
  },

  // 切换编辑模式
  toggleEditMode() {
    this.setData({
      isEditMode: !this.data.isEditMode
    })
  },

  // 跳转到文章
  goToArticle(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/article/article?id=${id}`
    })
  },

  // 删除收藏
  async deleteFavorite(e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条收藏吗?',
      confirmColor: '#D7942B',
      success: async (res) => {
        if (res.confirm) {
          // 乐观更新
          const favorites = this.data.favorites.filter(item => item.id !== id)
          this.setData({ favorites })

          try {
            // 使用 toggleBookmark 取消收藏
            await api.toggleBookmark(id)
            wx.showToast({ title: '已删除', icon: 'success' })
          } catch (err) {
            // 恢复数据
            this.loadFavorites()
            wx.showToast({ title: err.message || '删除失败', icon: 'none' })
          }
        }
      }
    })
  },

  // 清空全部收藏
  clearAllFavorites() {
    if (this.data.favorites.length === 0) {
      wx.showToast({ title: '暂无收藏', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认清空',
      content: '确定要清空全部收藏吗? 此操作不可恢复。',
      confirmColor: '#FF4757',
      success: async (res) => {
        if (res.confirm) {
          try {
            if (api.clearFavorites) {
              await api.clearFavorites()
            }
            this.setData({ favorites: [], isEditMode: false })
            wx.showToast({ title: '已清空', icon: 'success' })
          } catch (err) {
            wx.showToast({ title: err.message || '清空失败', icon: 'none' })
          }
        }
      }
    })
  }
})
