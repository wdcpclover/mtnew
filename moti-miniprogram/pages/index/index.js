/**
 * 最新页面 - 问题列表
 */

const app = getApp()

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    canGoBack: false,
    activeTab: 'latest',
    questions: [],
    loading: false,
    refreshing: false,
    page: 1,
    hasMore: true,
    unreadCount: 12 // 未读消息数
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const pages = getCurrentPages()

    this.setData({
      darkMode: app.globalData.darkMode || false,
      statusBarHeight: systemInfo.statusBarHeight,
      canGoBack: pages.length > 1
    })

    this.loadQuestions()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode || false
    })
  },

  // ============ 数据加载 ============

  async loadQuestions(loadMore = false) {
    if (this.data.loading) return
    if (loadMore && !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const page = loadMore ? this.data.page + 1 : 1

      // TODO: 替换为真实 API
      // const result = await api.getQuestions({ page, tab: this.data.activeTab })

      // 模拟数据
      await this.sleep(800)
      const mockQuestions = this.getMockQuestions()

      const hasMore = page < 3 // 模拟只有3页

      this.setData({
        questions: loadMore ? [...this.data.questions, ...mockQuestions] : mockQuestions,
        page,
        hasMore
      })

    } catch (err) {
      console.error('加载问题失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ refreshing: true, page: 1, hasMore: true })
    this.loadQuestions().finally(() => {
      this.setData({ refreshing: false })
    })
  },

  // 加载更多
  loadMore() {
    this.loadQuestions(true)
  },

  // ============ Tab 切换 ============

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    if (tab === this.data.activeTab) return

    this.setData({
      activeTab: tab,
      questions: [],
      page: 1,
      hasMore: true
    })

    this.loadQuestions()
  },

  // ============ 导航 ============

  handleBack() {
    wx.navigateBack({
      fail: () => wx.switchTab({ url: '/pages/index/index' })
    })
  },

  goToSearch() {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  goToMessages() {
    wx.navigateTo({ url: '/pages/messages/messages' })
  },

  goToTopics() {
    wx.switchTab({ url: '/pages/topics/topics' })
  },

  goToAsk() {
    wx.navigateTo({ url: '/pages/ask/ask' })
  },

  goToProfile() {
    wx.switchTab({ url: '/pages/profile/profile' })
  },

  openQuestion(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/question/question?id=' + id })
  },

  // ============ 工具方法 ============

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  // 模拟数据
  getMockQuestions() {
    const titles = [
      '如何在极度焦虑的现代生活中保持内心宁静？',
      '如何看待星光体旅行获得的信息？',
      '如何看待星光体旅行获得的信息？',
      '如何看待星光体旅行获得的信息？',
      '恋爱时双方的高我会怎么沟通？',
      '守不住财是什么原因？',
      '如何看待星光体旅行获得的信息？',
      '每周讨论：你认为物质极简能否带来精神富足？',
      '如何看待星光体旅行获得的信息？',
      '如何看待星光体旅行获得的信息？',
      '如何看待星光体旅行获得的信息？',
      '如何看待星光体旅行获得的信息？'
    ]

    return titles.map((title, i) => ({
      id: Date.now() + i,
      title,
      isHot: i < 8 && Math.random() > 0.3 // 前8个随机显示热标签
    }))
  }
})
