/**
 * 最新页面 - 问题列表
 */

const app = getApp()
const api = require('../../utils/api')

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
    const statusBarHeight = systemInfo.statusBarHeight
    // Custom nav bar height usually includes status bar + 44px (standard title bar height)
    // We use a safe estimate or platform specific. 44px is standard for iOS/Android in Wechat mostly.
    const navContentHeight = 44 
    const navBarHeight = statusBarHeight + navContentHeight

    this.setData({
      darkMode: app.globalData.darkMode || false,
      statusBarHeight: statusBarHeight,
      navBarHeight: navBarHeight,
      canGoBack: pages.length > 1
    })

    this.loadQuestions()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode || false
    })
  },

  // ============ 工具函数 ============

  // Fisher-Yates 洗牌算法
  shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  },

  // ============ 数据加载 ============

  async loadQuestions(loadMore = false) {
    if (this.data.loading) return
    if (loadMore && !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const page = loadMore ? this.data.page + 1 : 1
      const { activeTab } = this.data

      // 根据 tab 确定排序方式
      const sortMap = {
        'latest': 'recent',
        'hot': 'popular',
        'random': 'recent' // 随缘：先获取最新，然后打乱顺序
      }
      const sort = sortMap[activeTab] || 'recent'

      // 调用真实 API
      const result = await api.getPosts({
        page: page,
        limit: 20,
        sort: sort
      })

      // 处理返回的数据
      let questions = (result.topics || result.posts || result || []).map(post => ({
        id: post.pid || post.tid || post.id,
        title: post.title || post.titleRaw,
        isHot: post.votes > 10 || post.viewcount > 100
      }))

      // 如果是随缘模式，打乱顺序
      if (activeTab === 'random') {
        questions = this.shuffleArray(questions)
      }

      const hasMore = questions.length >= 20

      this.setData({
        questions: loadMore ? [...this.data.questions, ...questions] : questions,
        page,
        hasMore
      })

    } catch (err) {
      console.error('加载问题失败:', err)
      wx.showToast({ title: err.message || '加载失败', icon: 'none' })
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
    wx.navigateTo({ url: '/pages/article/article?id=' + id })
  },

  // ============ 分享 ============

  onShareAppMessage() {
    return {
      title: 'Moti 之地 - 发现有趣的问答',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    }
  },

  onShareTimeline() {
    return {
      title: 'Moti 之地 - 发现有趣的问答',
      imageUrl: '/images/share-cover.png'
    }
  }
})
