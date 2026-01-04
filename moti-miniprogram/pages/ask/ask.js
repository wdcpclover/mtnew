/**
 * 发起提问页面
 */

const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,

    // 表单数据
    title: '',
    content: '',
    selectedCategory: null,
    categories: [],

    // 状态
    submitting: false
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()

    this.setData({
      darkMode: app.globalData.darkMode || false,
      statusBarHeight: systemInfo.statusBarHeight
    })

    this.loadCategories()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode || false
    })
  },

  // ============ 数据加载 ============

  async loadCategories() {
    try {
      const result = await api.getCategories()
      const categories = result.categories || result || []

      this.setData({
        categories,
        selectedCategory: categories.length > 0 ? categories[0].cid : null
      })
    } catch (err) {
      console.error('加载分类失败:', err)
      wx.showToast({ title: '加载分类失败', icon: 'none' })
    }
  },

  // ============ 表单操作 ============

  onTitleInput(e) {
    this.setData({ title: e.detail.value })
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value })
  },

  onCategoryChange(e) {
    const index = parseInt(e.detail.value)
    if (this.data.categories[index]) {
      this.setData({
        selectedCategory: this.data.categories[index].cid
      })
    }
  },

  // ============ 提交 ============

  async handleSubmit() {
    const { title, content, selectedCategory, submitting } = this.data

    // 验证
    if (!title || !title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' })
      return
    }

    if (!content || !content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' })
      return
    }

    if (!selectedCategory) {
      wx.showToast({ title: '请选择分类', icon: 'none' })
      return
    }

    if (submitting) return

    this.setData({ submitting: true })

    try {
      // 调用发布接口
      const result = await api.createTopic({
        title: title.trim(),
        content: content.trim(),
        cid: selectedCategory,
        tags: []
      })

      wx.showToast({ title: '发布成功', icon: 'success' })

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        // 跳转到帖子详情页
        if (result.tid) {
          wx.redirectTo({
            url: `/pages/article/article?id=${result.tid}`
          })
        } else {
          // 如果没有返回 tid，返回上一页
          wx.navigateBack()
        }
      }, 1500)

    } catch (err) {
      console.error('发布失败:', err)

      // 根据错误类型显示不同的提示
      let errorMsg = '发布失败'
      if (err.message.includes('vip-required')) {
        errorMsg = '发布帖子需要 VIP 权限'
      } else if (err.message.includes('not-logged-in')) {
        errorMsg = '请先登录'
      } else if (err.message) {
        errorMsg = err.message
      }

      wx.showToast({ title: errorMsg, icon: 'none', duration: 2000 })
      this.setData({ submitting: false })
    }
  },

  handleCancel() {
    wx.navigateBack()
  }
})
