/**
 * 合集页面 - 章节列表
 */

const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    canGoBack: false,
    unreadCount: 12,

    // 搜索状态
    searchValue: '',
    isSearching: false,
    showSuggestions: false,
    suggestions: [],

    // 筛选状态
    chapterMode: false,
    isAllExpanded: false,

    // 数据
    chapters: [],
    loading: false,
    refreshing: false
  },

  // 搜索防抖定时器
  searchTimer: null,

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const pages = getCurrentPages()

    this.setData({
      darkMode: app.globalData.darkMode || false,
      statusBarHeight: systemInfo.statusBarHeight,
      canGoBack: pages.length > 1
    })

    this.loadChapters()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode || false
    })
  },

  // ============ 数据加载 ============

  async loadChapters() {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      // 获取所有分类
      const result = await api.getCategories()
      const categories = result.categories || result || []

      // 将分类数据转换为章节格式
      const chapters = await Promise.all(
        categories.map(async (cat, index) => {
          // 获取该分类下的主题列表
          let articles = []
          try {
            const topicsResult = await api.getCategoryTopics(cat.cid, { page: 1, limit: 10 })
            articles = (topicsResult.topics || topicsResult || []).map(topic => ({
              id: topic.tid || topic.id,
              title: topic.title || topic.titleRaw,
              isRead: false // 暂时设为未读，后续可以根据用户阅读历史判断
            }))
          } catch (err) {
            console.warn(`加载分类 ${cat.cid} 的主题失败:`, err)
          }

          return {
            id: cat.cid,
            category: cat.name,
            title: cat.description || cat.name,
            isActive: index === 0,
            isExpanded: false,
            articles: articles
          }
        })
      )

      this.setData({ chapters })
    } catch (err) {
      console.error('加载章节失败:', err)
      wx.showToast({ title: err.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 下拉刷新
  onRefresh() {
    this.setData({ refreshing: true })
    this.loadChapters().finally(() => {
      this.setData({ refreshing: false })
    })
  },

  // ============ 搜索功能 ============

  // 搜索输入
  onSearchInput(e) {
    const value = e.detail.value
    this.setData({ searchValue: value })

    // 防抖搜索建议
    if (this.searchTimer) {
      clearTimeout(this.searchTimer)
    }

    if (value.trim()) {
      this.searchTimer = setTimeout(() => {
        this.loadSuggestions(value)
      }, 300)
    } else {
      this.setData({
        suggestions: [],
        showSuggestions: false
      })
    }
  },

  // 搜索框获得焦点
  onSearchFocus() {
    this.setData({ isSearching: true })
    if (this.data.searchValue.trim()) {
      this.loadSuggestions(this.data.searchValue)
    }
  },

  // 搜索确认
  onSearchConfirm() {
    const { searchValue } = this.data
    if (!searchValue.trim()) return

    this.hideSearch()
    // 跳转到搜索结果页或执行搜索
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(searchValue)}`
    })
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchValue: '',
      suggestions: [],
      showSuggestions: false
    })
  },

  // 隐藏搜索建议
  hideSearch() {
    this.setData({
      isSearching: false,
      showSuggestions: false
    })
  },

  // 加载搜索建议
  async loadSuggestions(keyword) {
    try {
      // 搜索帖子标题
      const result = await api.searchPosts(keyword, { page: 1, limit: 5 })
      const posts = result.posts || result || []

      const suggestions = posts.map(post => ({
        id: post.pid || post.tid || post.id,
        full: post.title || post.titleRaw,
        rest: (post.title || post.titleRaw).substring(keyword.length)
      }))

      this.setData({
        suggestions: suggestions,
        showSuggestions: suggestions.length > 0
      })
    } catch (err) {
      console.warn('搜索建议加载失败:', err)
      this.setData({
        suggestions: [],
        showSuggestions: false
      })
    }
  },

  // 选择搜索建议
  selectSuggestion(e) {
    const item = e.currentTarget.dataset.item

    this.setData({
      searchValue: item.full,
      showSuggestions: false,
      isSearching: false
    })

    // 跳转到文章详情
    wx.navigateTo({
      url: `/pages/article/article?id=${item.id}`
    })
  },

  // ============ 展开/收起 ============

  // 切换章节模式
  toggleChapterMode() {
    this.setData({
      chapterMode: !this.data.chapterMode
    })
  },

  // 展开/收起全部
  toggleExpandAll() {
    const isAllExpanded = !this.data.isAllExpanded
    const chapters = this.data.chapters.map(chapter => ({
      ...chapter,
      isExpanded: isAllExpanded
    }))

    this.setData({
      isAllExpanded,
      chapters
    })
  },

  // 切换单个章节
  toggleChapter(e) {
    const index = e.currentTarget.dataset.index
    const chapters = [...this.data.chapters]

    // 设置当前项为激活状态
    chapters.forEach((chapter, i) => {
      chapter.isActive = i === index
    })

    // 切换展开状态
    chapters[index].isExpanded = !chapters[index].isExpanded

    // 检查是否全部展开
    const isAllExpanded = chapters.every(chapter => chapter.isExpanded)

    this.setData({
      chapters,
      isAllExpanded
    })
  },

  // ============ 导航 ============

  handleBack() {
    wx.navigateBack({
      fail: () => wx.switchTab({ url: '/pages/index/index' })
    })
  },

  goToSearch() {
    this.setData({ isSearching: true })
  },

  goToMessages() {
    wx.navigateTo({ url: '/pages/messages/messages' })
  },

  goToHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goToAsk() {
    wx.navigateTo({ url: '/pages/ask/ask' })
  },

  goToProfile() {
    wx.switchTab({ url: '/pages/profile/profile' })
  },

  openArticle(e) {
    const { chapterIndex, articleIndex } = e.currentTarget.dataset
    const chapter = this.data.chapters[chapterIndex]
    const article = chapter.articles[articleIndex]

    // 标记为已读
    const chapters = [...this.data.chapters]
    chapters[chapterIndex].articles[articleIndex].isRead = true
    this.setData({ chapters })

    wx.navigateTo({
      url: `/pages/article/article?id=${article.id}&title=${encodeURIComponent(article.title)}`
    })
  },

  // ============ 分享 ============

  onShareAppMessage() {
    return {
      title: 'Moti 之地 - 精选合集',
      path: '/pages/topics/topics',
      imageUrl: '/images/share-cover.png'
    }
  },

  onShareTimeline() {
    return {
      title: 'Moti 之地 - 精选合集',
      imageUrl: '/images/share-cover.png'
    }
  }
})
