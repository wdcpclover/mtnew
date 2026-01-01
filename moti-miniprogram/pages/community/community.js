/**
 * 提问页面 - 问题列表
 */

const app = getApp()

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    canGoBack: false,

    // 用户信息
    userAvatar: '',
    userName: '莫提',
    unreadCount: 12,

    // 排序和筛选
    sortOptions: [
      { label: '按时间', value: 'time' },
      { label: '按热度', value: 'hot' }
    ],
    currentSort: 0,
    showSortMenu: false,
    showFilterPanel: false,

    // 话题标签
    topics: [],
    selectedTopics: [],

    // 问题列表
    questions: [],
    loading: false,
    refreshing: false,
    page: 1,
    hasMore: true
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const pages = getCurrentPages()

    this.setData({
      darkMode: app.globalData.darkMode || false,
      statusBarHeight: systemInfo.statusBarHeight,
      canGoBack: pages.length > 1
    })

    // 获取用户信息
    if (app.globalData.userInfo) {
      this.setData({
        userAvatar: app.globalData.userInfo.avatarUrl,
        userName: app.globalData.userInfo.nickName
      })
    }

    this.loadTopics()
    this.loadQuestions()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode || false
    })
  },

  // ============ 数据加载 ============

  async loadTopics() {
    // TODO: 替换为真实 API
    const topics = [
      { id: 1, name: '灵性' },
      { id: 2, name: '科技' },
      { id: 3, name: '成长' },
      { id: 4, name: '其他' },
      { id: 5, name: '外星人' },
      { id: 6, name: '灵性' },
      { id: 7, name: '灵性' },
      { id: 8, name: '灵性' },
      { id: 9, name: '灵性' },
      { id: 10, name: '灵性' }
    ]
    this.setData({ topics })
  },

  async loadQuestions(loadMore = false) {
    if (this.data.loading) return
    if (loadMore && !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const page = loadMore ? this.data.page + 1 : 1

      // TODO: 替换为真实 API
      await this.sleep(600)
      const questions = this.getMockQuestions()

      const hasMore = page < 3

      this.setData({
        questions: loadMore ? [...this.data.questions, ...questions] : questions,
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

  // ============ 排序和筛选 ============

  toggleSortMenu() {
    this.setData({ showSortMenu: !this.data.showSortMenu })
  },

  hideSortMenu() {
    this.setData({ showSortMenu: false })
  },

  selectSort(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentSort: index,
      showSortMenu: false,
      questions: [],
      page: 1,
      hasMore: true
    })
    this.loadQuestions()
  },

  toggleFilterPanel() {
    this.setData({ showFilterPanel: !this.data.showFilterPanel })
  },

  toggleTopic(e) {
    const id = e.currentTarget.dataset.id
    let selectedTopics = [...this.data.selectedTopics]

    const index = selectedTopics.indexOf(id)
    if (index > -1) {
      selectedTopics.splice(index, 1)
    } else {
      selectedTopics.push(id)
    }

    this.setData({
      selectedTopics,
      questions: [],
      page: 1,
      hasMore: true
    })
    this.loadQuestions()
  },

  preventBubble() {
    // 阻止事件冒泡
  },

  // ============ 导航 ============

  handleBack() {
    wx.navigateBack({
      fail: () => wx.switchTab({ url: '/pages/index/index' })
    })
  },

  goToMessages() {
    wx.navigateTo({ url: '/pages/messages/messages' })
  },

  goToHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goToTopics() {
    wx.switchTab({ url: '/pages/topics/topics' })
  },

  goToProfile() {
    wx.switchTab({ url: '/pages/profile/profile' })
  },

  openAskModal() {
    // TODO: 打开发起提问弹窗或跳转到提问页面
    wx.showToast({ title: '发起提问', icon: 'none' })
  },

  openQuestion(e) {
    const id = e.currentTarget.dataset.id

    // 标记为已读
    const questions = this.data.questions.map(q => {
      if (q.id === id) {
        return { ...q, isRead: true }
      }
      return q
    })
    this.setData({ questions })

    wx.navigateTo({
      url: `/pages/question/question?id=${id}`
    })
  },

  // ============ 工具方法 ============

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  getMockQuestions() {
    return [
      { id: 1, voteCount: 999, title: '如何在极度焦虑的现代生活中保持内心宁静？', isHot: true, isRead: false },
      { id: 2, voteCount: 19, title: '如何看待星光体旅行获得的信息？', isHot: true, isRead: false },
      { id: 3, voteCount: 11, title: '守不住财是什么原因？', isHot: false, isRead: true },
      { id: 4, voteCount: 20, title: '如何在极度焦虑的现代生活中保持内心宁静？', isHot: true, isRead: false },
      { id: 5, voteCount: 11, title: '如何在极度焦虑的现代生活中保持内心宁静？', isHot: false, isRead: false },
      { id: 6, voteCount: 20, title: '如何在极度焦虑的现代生活中保持内心宁静？', isHot: true, isRead: true },
      { id: 7, voteCount: 20, title: '如何看待星光体旅行获得的信息？', isHot: true, isRead: false },
      { id: 8, voteCount: 20, title: '每周讨论：你认为物质极简能否带来精神富足？', isHot: true, isRead: false },
      { id: 9, voteCount: 20, title: '如何看待星光体旅行获得的信息？', isHot: true, isRead: false },
      { id: 10, voteCount: 20, title: '如何看待星光体旅行获得的信息？', isHot: true, isRead: false },
      { id: 11, voteCount: 20, title: '如何在极度焦虑的现代生活中保持内心宁静？', isHot: true, isRead: false },
      { id: 12, voteCount: 20, title: '如何在极度焦虑的现代生活中保持内心宁静？', isHot: true, isRead: true }
    ]
  }
})
