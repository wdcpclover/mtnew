const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    navBarHeight: 0,
    currentTab: 'comments',
    isCollapsed: false,
    commentCount: 9,
    systemCount: 3,
    comments: [],
    systemMessages: [],
    loading: true,
    // 滑动相关
    startX: 0,
    moveX: 0
  },

  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const statusBarHeight = systemInfo.statusBarHeight
    // 导航栏高度 = 状态栏 + 导航内容高度(44px)
    const navBarHeight = statusBarHeight + 44

    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: statusBarHeight,
      navBarHeight: navBarHeight
    })

    this.loadMessages()
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode
    })
  },

  // 加载消息
  async loadMessages() {
    this.setData({ loading: true })

    try {
      if (api.getMessages) {
        const result = await api.getMessages()
        this.setData({
          comments: result.comments || [],
          systemMessages: result.systemMessages || [],
          commentCount: result.commentCount || 0,
          systemCount: result.systemCount || 0,
          loading: false
        })
      } else {
        this.loadMockData()
      }
    } catch (err) {
      console.error('加载消息失败:', err)
      this.loadMockData()
    }
  },

  // 加载模拟数据
  loadMockData() {
    const mockComments = [
      {
        id: 1,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '我也感觉z时间在加速，人内心的声音以不同的速度显化...',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 2,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '给你点赞',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 3,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '给你点赞',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 4,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '我也感觉z时间在加速，人内心的声音以不同的速度显化...',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 5,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '我也感觉z时间在加速，人内心的声音以不同的速度显化...',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 6,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '我也感觉z时间在加速，人内心的声音以不同的速度显化...',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 7,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '我也感觉z时间在加速，人内心的声音以不同的速度显化...',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 8,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '我也感觉z时间在加速，人内心的声音以不同的速度显化...',
        time: '20分钟前',
        swiped: false
      },
      {
        id: 9,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        content: '我也感觉z时间在加速，人内心的声音以不同的速度显化...',
        time: '20分钟前',
        swiped: false
      }
    ]

    const mockSystemMessages = [
      {
        id: 1,
        title: '新版本v.2已经更新',
        date: '1月20日',
        swiped: false
      },
      {
        id: 2,
        title: '新版本v.2已经更新',
        date: '1月20日',
        swiped: false
      },
      {
        id: 3,
        title: '新版本v.2已经更新',
        date: '1月20日',
        swiped: false
      }
    ]

    this.setData({
      comments: mockComments,
      systemMessages: mockSystemMessages,
      commentCount: mockComments.length,
      systemCount: mockSystemMessages.length,
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
      itemList: ['全部标为已读', '清空全部消息'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.markAllRead()
        } else if (res.tapIndex === 1) {
          this.clearAllMessages()
        }
      }
    })
  },

  // 切换 Tab
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    // 重置所有滑动状态
    this.resetAllSwipe()
    this.setData({ currentTab: tab })
  },

  // 切换收起/展开
  toggleCollapse() {
    this.setData({ isCollapsed: !this.data.isCollapsed })
  },

  // 跳转到详情
  goToDetail(e) {
    const { id, type } = e.currentTarget.dataset
    if (type === 'comment') {
      // 跳转到评论相关的文章
      wx.navigateTo({
        url: `/pages/article/article?id=${id}`
      })
    } else {
      // 系统消息详情
      wx.showToast({ title: '查看系统消息', icon: 'none' })
    }
  },

  // 触摸开始
  onTouchStart(e) {
    this.setData({
      startX: e.touches[0].clientX
    })
  },

  // 触摸移动
  onTouchMove(e) {
    const moveX = e.touches[0].clientX - this.data.startX
    this.setData({ moveX })
  },

  // 触摸结束
  onTouchEnd(e) {
    const { index, type } = e.currentTarget.dataset
    const moveX = this.data.moveX

    // 左滑超过 50px 显示删除按钮
    if (moveX < -50) {
      this.resetAllSwipe()
      if (type === 'comments') {
        this.setData({
          [`comments[${index}].swiped`]: true
        })
      } else {
        this.setData({
          [`systemMessages[${index}].swiped`]: true
        })
      }
    } else if (moveX > 50) {
      // 右滑恢复
      this.resetAllSwipe()
    }

    this.setData({ moveX: 0 })
  },

  // 重置所有滑动状态
  resetAllSwipe() {
    const comments = this.data.comments.map(item => ({ ...item, swiped: false }))
    const systemMessages = this.data.systemMessages.map(item => ({ ...item, swiped: false }))
    this.setData({ comments, systemMessages })
  },

  // 删除消息
  async deleteMessage(e) {
    const { index, type } = e.currentTarget.dataset

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条消息吗?',
      confirmColor: '#D7942B',
      success: async (res) => {
        if (res.confirm) {
          if (type === 'comments') {
            const comments = [...this.data.comments]
            comments.splice(index, 1)
            this.setData({
              comments,
              commentCount: comments.length
            })
          } else {
            const systemMessages = [...this.data.systemMessages]
            systemMessages.splice(index, 1)
            this.setData({
              systemMessages,
              systemCount: systemMessages.length
            })
          }

          try {
            if (api.deleteMessage) {
              await api.deleteMessage(e.currentTarget.dataset.id)
            }
          } catch (err) {
            console.error('删除失败:', err)
          }

          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  // 全部标为已读
  markAllRead() {
    this.setData({
      commentCount: 0,
      systemCount: 0
    })
    wx.showToast({ title: '已全部标为已读', icon: 'success' })
  },

  // 清空全部消息
  clearAllMessages() {
    const total = this.data.comments.length + this.data.systemMessages.length
    if (total === 0) {
      wx.showToast({ title: '暂无消息', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认清空',
      content: '确定要清空全部消息吗?',
      confirmColor: '#FF4757',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            comments: [],
            systemMessages: [],
            commentCount: 0,
            systemCount: 0
          })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  }
})
