/**
 * 提问页面 - 问题列表
 */

const app = getApp()
const api = require('../../utils/api')

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
    try {
      // 获取标签列表
      const tags = await api.getTags()
      const topics = tags.map(tag => ({
        id: tag.value || tag.tag,
        name: tag.value || tag.tag
      }))
      this.setData({ topics })
    } catch (err) {
      console.warn('加载话题标签失败:', err)
      this.setData({ topics: [] })
    }
  },

  async loadQuestions(loadMore = false) {
    if (this.data.loading) return
    if (loadMore && !this.data.hasMore) return

    this.setData({ loading: true })

    try {
      const page = loadMore ? this.data.page + 1 : 1
      const { currentSort, selectedTopics } = this.data

      // 根据排序获取数据
      const sortMap = ['time', 'hot']
      const sortValue = sortMap[currentSort] === 'time' ? 'recent' : 'votes'

      // 构建请求参数
      const params = {
        page: page,
        limit: 20,
        sort: sortValue
      }

      // 如果有选中的话题标签，添加过滤条件
      // 注意：后端可能不支持按标签过滤，这里作为占位
      if (selectedTopics.length > 0) {
        params.tags = selectedTopics.join(',')
      }

      // 调用真实 API
      const result = await api.getPosts(params)

      // 处理返回的数据
      const questions = (result.topics || result.posts || result || []).map(post => ({
        id: post.tid || post.pid || post.id,
        voteCount: post.votes || 0,
        title: post.title || post.titleRaw,
        isHot: post.votes > 10 || post.viewcount > 100,
        isRead: false
      }))

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
    // 跳转到发起提问页面
    wx.navigateTo({ url: '/pages/ask/ask' })
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
      url: `/pages/article/article?id=${id}`
    })
  },

  // ============ 分享 ============

  onShareAppMessage() {
    return {
      title: 'Moti 之地 - 一起来提问',
      path: '/pages/community/community',
      imageUrl: '/images/share-cover.png'
    }
  },

  onShareTimeline() {
    return {
      title: 'Moti 之地 - 一起来提问',
      imageUrl: '/images/share-cover.png'
    }
  }
})
