/**
 * 合集页面 - 章节列表
 */

const app = getApp()

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
      // TODO: 替换为真实 API
      await this.sleep(600)
      const chapters = this.getMockChapters()

      this.setData({ chapters })
    } catch (err) {
      console.error('加载章节失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
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
    // TODO: 替换为真实 API
    // const result = await api.getSearchSuggestions(keyword)

    // 模拟搜索建议
    const mockSuggestions = this.getMockSuggestions(keyword)

    this.setData({
      suggestions: mockSuggestions,
      showSuggestions: mockSuggestions.length > 0
    })
  },

  // 选择搜索建议
  selectSuggestion(e) {
    const item = e.currentTarget.dataset.item
    const fullText = this.data.searchValue + item.rest

    this.setData({
      searchValue: fullText,
      showSuggestions: false,
      isSearching: false
    })

    // 跳转到搜索结果或文章
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(fullText)}`
    })
  },

  // 获取模拟搜索建议
  getMockSuggestions(keyword) {
    const allSuggestions = [
      { id: 1, full: '如何提升自我能量' },
      { id: 2, full: '如何提升稳定性' },
      { id: 3, full: '如何提升自我认知' },
      { id: 4, full: '如何提升自我能量' },
      { id: 5, full: '如何提升自我能量' }
    ]

    // 过滤匹配的建议，并计算剩余部分
    return allSuggestions
      .filter(item => item.full.startsWith(keyword))
      .map(item => ({
        id: item.id,
        full: item.full,
        rest: item.full.substring(keyword.length)
      }))
      .slice(0, 5)
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

  // ============ 工具方法 ============

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  // 模拟数据
  getMockChapters() {
    return [
      {
        id: 1,
        category: '兴奋公式',
        title: '一/道/真理/真相?',
        isActive: true,
        isExpanded: false,
        articles: [
          { id: 101, title: '如何看待星光体旅行获得的信息？', isRead: false },
          { id: 102, title: '如何看待星光体旅行获得的信息？', isRead: false },
          { id: 103, title: '如何看待星光体旅行获得的信息？', isRead: true }
        ]
      },
      {
        id: 2,
        category: '兴奋公式',
        title: '一/道/真理/真相?',
        isActive: false,
        isExpanded: false,
        articles: [
          { id: 201, title: '如何看待星光体旅行获得的信息？', isRead: false }
        ]
      },
      {
        id: 3,
        category: '信念',
        title: '一/道/真理/真相?',
        isActive: false,
        isExpanded: false,
        articles: [
          { id: 301, title: '如何看待星光体旅行获得的信息？', isRead: false },
          { id: 302, title: '如何看待星光体旅行获得的信息？', isRead: true }
        ]
      },
      {
        id: 4,
        category: '信念',
        title: '一/道/真理/真相?',
        isActive: false,
        isExpanded: false,
        articles: [
          { id: 401, title: '如何看待星光体旅行获得的信息？', isRead: false }
        ]
      },
      {
        id: 5,
        category: '意识许可',
        title: '一/道/真理/真相?',
        isActive: false,
        isExpanded: false,
        articles: [
          { id: 501, title: '关于真理', isRead: false },
          { id: 502, title: '如何看待星光体旅行获得的信息？', isRead: false }
        ]
      },
      {
        id: 6,
        category: '意识许可',
        title: '一/道/真理/真相?',
        isActive: false,
        isExpanded: false,
        articles: [
          { id: 601, title: '如何看待星光体旅行获得的信息？', isRead: false }
        ]
      },
      {
        id: 7,
        category: '信念',
        title: '一/道/真理/真相?',
        isActive: false,
        isExpanded: false,
        articles: [
          { id: 701, title: '一／道／真理／真相?', isRead: false },
          { id: 702, title: '如何看待星光体旅行获得的信息？', isRead: true },
          { id: 703, title: '如何看待星光体旅行获得的信息？', isRead: false }
        ]
      },
      {
        id: 8,
        category: '信念',
        title: '',
        isActive: false,
        isExpanded: false,
        articles: []
      },
      {
        id: 9,
        category: '信念',
        title: '',
        isActive: false,
        isExpanded: false,
        articles: []
      },
      {
        id: 10,
        category: '信念',
        title: '',
        isActive: false,
        isExpanded: false,
        articles: []
      },
      {
        id: 11,
        category: '意识许可',
        title: '',
        isActive: false,
        isExpanded: false,
        articles: []
      },
      {
        id: 12,
        category: '意识许可',
        title: '',
        isActive: false,
        isExpanded: false,
        articles: []
      }
    ]
  }
})
