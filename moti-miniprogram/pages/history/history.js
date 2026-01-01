const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    navBarHeight: 0,
    isEditMode: false,
    historyList: [],
    todayList: [],
    weekList: [],
    monthList: [],
    loading: true
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const statusBarHeight = systemInfo.statusBarHeight
    const navBarHeight = statusBarHeight + 44

    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: statusBarHeight,
      navBarHeight: navBarHeight
    })

    this.loadHistory()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode
    })
  },

  // 加载浏览记录
  async loadHistory() {
    this.setData({ loading: true })

    try {
      if (api.getHistory) {
        const result = await api.getHistory()
        this.processHistoryData(result.list || result || [])
      } else {
        this.loadMockData()
      }
    } catch (err) {
      console.error('加载浏览记录失败:', err)
      this.loadMockData()
    }
  },

  // 加载模拟数据
  loadMockData() {
    const mockData = [
      // 今天
      { id: 1, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 30 },
      { id: 2, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 },
      { id: 3, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 * 2 },
      { id: 4, title: '恋爱时双方的高我会怎么沟通?', time: Date.now() - 1000 * 60 * 60 * 5 },
      // 近一周
      { id: 5, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 * 24 * 2 },
      { id: 6, title: '每周讨论：你认为物质极简能否带来精神富足?', time: Date.now() - 1000 * 60 * 60 * 24 * 3 },
      { id: 7, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 * 24 * 4 },
      { id: 8, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 * 24 * 5 },
      // 近一个月
      { id: 9, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 * 24 * 10 },
      { id: 10, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 * 24 * 15 },
      { id: 11, title: '如何看待星光体旅行获得的信息?', time: Date.now() - 1000 * 60 * 60 * 24 * 20 }
    ]

    this.processHistoryData(mockData)
  },

  // 处理历史数据分组
  processHistoryData(list) {
    const now = Date.now()
    const dayMs = 1000 * 60 * 60 * 24
    const todayStart = new Date().setHours(0, 0, 0, 0)

    const todayList = []
    const weekList = []
    const monthList = []

    list.forEach(item => {
      const itemTime = item.time || Date.now()
      if (itemTime >= todayStart) {
        todayList.push(item)
      } else if (itemTime >= now - dayMs * 7) {
        weekList.push(item)
      } else if (itemTime >= now - dayMs * 30) {
        monthList.push(item)
      }
    })

    this.setData({
      historyList: list,
      todayList,
      weekList,
      monthList,
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
      itemList: ['清空全部记录'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.clearAllHistory()
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

  // 删除单条记录
  deleteItem(e) {
    const { id, group } = e.currentTarget.dataset

    const groupKey = group + 'List'
    const list = this.data[groupKey].filter(item => item.id !== id)
    const historyList = this.data.historyList.filter(item => item.id !== id)

    this.setData({
      [groupKey]: list,
      historyList
    })

    wx.showToast({ title: '已删除', icon: 'success' })
  },

  // 清空全部记录
  clearAllHistory() {
    if (this.data.historyList.length === 0) {
      wx.showToast({ title: '暂无记录', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认清空',
      content: '确定要清空全部浏览记录吗?',
      confirmColor: '#FF4757',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            historyList: [],
            todayList: [],
            weekList: [],
            monthList: [],
            isEditMode: false
          })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  }
})
