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
      if (api.getFavorites) {
        const result = await api.getFavorites()
        const favorites = result.favorites || result || []

        this.setData({
          favorites: favorites.map(item => ({
            ...item,
            isHot: item.isHot || item.hot || Math.random() > 0.3 // 模拟热门标签
          })),
          loading: false
        })
      } else {
        // 加载模拟数据
        this.loadMockData()
      }
    } catch (err) {
      console.error('加载收藏失败:', err)
      // 加载模拟数据
      this.loadMockData()
    }
  },

  // 加载模拟数据
  loadMockData() {
    const mockFavorites = [
      { id: 1, title: '如何在极度焦虑的现代生活中保持内心宁静?', isHot: true },
      { id: 2, title: '如何看待星光体旅行获得的信息?', isHot: true },
      { id: 3, title: '如何看待星光体旅行获得的信息?', isHot: true },
      { id: 4, title: '如何看待星光体旅行获得的信息?', isHot: true },
      { id: 5, title: '恋爱时双方的高我会怎么沟通?', isHot: true },
      { id: 6, title: '守不住财是什么原因?', isHot: true },
      { id: 7, title: '如何看待星光体旅行获得的信息?', isHot: true },
      { id: 8, title: '每周讨论：你认为物质极简能否带来精神富足?', isHot: false },
      { id: 9, title: '如何看待星光体旅行获得的信息?', isHot: true },
      { id: 10, title: '如何看待星光体旅行获得的信息?', isHot: true },
      { id: 11, title: '如何看待星光体旅行获得的信息?', isHot: true },
      { id: 12, title: '如何看待星光体旅行获得的信息?', isHot: true }
    ]

    this.setData({
      favorites: mockFavorites,
      loading: false
    })
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
            if (api.removeFavorite) {
              await api.removeFavorite(id)
            }
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
