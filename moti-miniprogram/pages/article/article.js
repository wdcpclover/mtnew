const app = getApp()
const api = require('../../utils/api')

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    article: null,
    isFavorite: false,
    hasInspired: false,
    commentText: '',
    commentPreview: '',
    comments: [],
    loading: true,
    commentsLoading: false,
    commentsPage: 1,
    hasMoreComments: true,
    articleId: null,
    // 读者头像
    readerAvatars: [],
    readerCount: 0,
    // 复制弹窗
    showCopyPopup: false,
    copyPopupTop: 0,
    copyPopupLeft: 0,
    selectedText: '',
    // 评论输入
    showCommentInput: false,
    replyToComment: null
  },

  onLoad(options) {
    const systemInfo = wx.getSystemInfoSync()
    const articleId = options.id

    this.setData({
      darkMode: app.globalData.darkMode,
      statusBarHeight: systemInfo.statusBarHeight,
      articleId: articleId
    })

    if (articleId) {
      this.loadArticle(articleId)
    } else {
      // 加载模拟数据用于演示
      this.loadMockData()
    }
  },

  onShow() {
    this.setData({
      darkMode: app.globalData.darkMode
    })
  },

  // 加载模拟数据
  loadMockData() {
    const mockArticle = {
      title: '萨古鲁为什么会生病?',
      displayTitle: '萨古鲁为什么会生病?',
      question: '萨古鲁为什么会生病？是走错了方向在被宇宙提醒他转变吗？他都开悟了呀',
      questionAuthor: '金念',
      paragraphs: [
        {
          type: 'author',
          author: '金念',
          content: '为什么生病是坏事儿呢？因为人们默认用物质身体定义人生，这已经是根深蒂固因元信念。所以认为死亡长老、疾病是不好的，是一种消亡和缺失。尤其是因为这些体验之中伴随着生理上的痛苦，是要极力避免的。但这样的话，你的生命体验就会变成了为了减重量，为了超越死亡。为了躲避病痛而活着。'
        },
        {
          type: 'normal',
          content: '一个人生病有很多原因，病并不光可以提醒你，你有了disease, dis-ease。同时也和任何一个情景一样把你引入新的境遇，也是一种缘分。'
        },
        {
          type: 'normal',
          content: '我认为萨古鲁生病，而且要通过西医的手术来治疗，是一件非常好的事儿。其意义在于破除人们对于"大师"的盲目崇拜，校正灵性与科技对立的思想，让他全球上亿的追随者明白只有悟是追求内在意识中的超越性从而更好地把作为一个人活着，而不是追求神性的超越，生病不是愚蠢，生命的任何一种境遇都是中性的，值得被激赏的。萨古鲁虽然已经历病痛，但他的病许不是为自己而生。'
        },
        {
          type: 'normal',
          content: '当年耶稳允许自己被钉在十字架上，也是为了向人们展示死亡并不代表人个体的消亡。所以他通过死而复生向人们展死亡究竟有什么值得惧怕的。'
        }
      ]
    }

    const mockComments = [
      {
        id: 1,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        badge: '莫提',
        date: '2025/10/01 20:10',
        content: '释放出一个所有人都可以用的意识许可，一个频率，也就是宽恕，宽恕就是neutralization，任何人都可以通过"宽恕"来校准自己的能量\n\n第四行，释放出一个所有人都可以用的意识许可......',
        hasMore: true,
        replyCount: 0,
        likeCount: 21,
        isLiked: false
      },
      {
        id: 2,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        badge: '莫提',
        date: '2025/10/01 20:10',
        content: '释放出一个所有人都可以用的意识许可，一个频率，也就是宽恕，宽恕就是neutralization，任何人都可以通过"宽恕"来校准自己的能量',
        hasMore: false,
        replyCount: 0,
        likeCount: 21,
        isLiked: false
      },
      {
        id: 3,
        avatar: '/images/avatars/default.svg',
        author: '莫提',
        badge: '莫提',
        date: '2025/10/01 20:10',
        content: '释放出一个所有人都可以用的意识许可，一个频率，也就是宽恕，宽恕就是neutralization，任何人都可以通过"宽恕"来校准自己的能量',
        hasMore: false,
        replyCount: 0,
        likeCount: 21,
        isLiked: false
      }
    ]

    const mockReaderAvatars = [
      '/images/avatars/default.svg',
      '/images/avatars/default.svg',
      '/images/avatars/default.svg',
      '/images/avatars/default.svg',
      '/images/avatars/koala.png'
    ]

    this.setData({
      article: mockArticle,
      comments: mockComments,
      readerAvatars: mockReaderAvatars,
      readerCount: 100,
      loading: false
    })
  },

  // 加载文章详情
  async loadArticle(pid) {
    this.setData({ loading: true })

    try {
      const article = await api.getPostDetail(pid)

      this.setData({
        article: article,
        isFavorite: article.isBookmarked || false,
        hasInspired: article.hasInspired || false,
        readerAvatars: article.readerAvatars || [],
        readerCount: article.readerCount || 0,
        loading: false
      })

      // 加载评论
      this.loadComments()

    } catch (err) {
      console.error('加载文章失败:', err)
      this.setData({ loading: false })

      if (err.message && (err.message.includes('VIP') || err.message.includes('阅读次数'))) {
        wx.showModal({
          title: '阅读限制',
          content: err.message,
          confirmText: '开通 VIP',
          cancelText: '返回',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/vip/vip' })
            } else {
              wx.navigateBack()
            }
          }
        })
      } else {
        // 加载模拟数据用于演示
        this.loadMockData()
      }
    }
  },

  // 加载评论
  async loadComments(loadMore = false) {
    if (this.data.commentsLoading) return
    if (loadMore && !this.data.hasMoreComments) return

    this.setData({ commentsLoading: true })

    try {
      const page = loadMore ? this.data.commentsPage + 1 : 1
      const result = await api.getComments(this.data.articleId, {
        page: page,
        limit: 20
      })

      const comments = result.comments || result || []
      const hasMore = comments.length >= 20

      // 格式化评论数据
      const formattedComments = comments.map(comment => ({
        ...comment,
        badge: comment.isMoti ? '莫提' : null,
        hasMore: comment.content && comment.content.length > 100
      }))

      this.setData({
        comments: loadMore ? [...this.data.comments, ...formattedComments] : formattedComments,
        commentsPage: page,
        hasMoreComments: hasMore
      })
    } catch (err) {
      console.error('加载评论失败:', err)
    } finally {
      this.setData({ commentsLoading: false })
    }
  },

  // 加载更多评论
  loadMoreComments() {
    this.loadComments(true)
  },

  // 返回
  goBack() {
    wx.navigateBack()
  },

  // 显示更多菜单
  showMore() {
    wx.showActionSheet({
      itemList: ['收藏', '分享', '举报'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.toggleFavorite()
        } else if (res.tapIndex === 1) {
          this.shareArticle()
        }
      }
    })
  },

  showMenu() {
    wx.showActionSheet({
      itemList: ['刷新', '字体大小', '夜间模式'],
      success: (res) => {
        if (res.tapIndex === 2) {
          const darkMode = !this.data.darkMode
          this.setData({ darkMode })
          app.setDarkMode(darkMode)
        }
      }
    })
  },

  // 切换收藏
  async toggleFavorite() {
    if (!app.checkLogin || !app.checkLogin()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    const currentState = this.data.isFavorite
    this.setData({ isFavorite: !currentState })

    try {
      const result = await api.toggleBookmark(this.data.articleId)
      wx.showToast({
        title: result.bookmarked ? '已收藏' : '已取消收藏',
        icon: 'none'
      })
      this.setData({ isFavorite: result.bookmarked })
    } catch (err) {
      this.setData({ isFavorite: currentState })
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    }
  },

  // 切换有启发
  async toggleInspire() {
    if (!app.checkLogin || !app.checkLogin()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    const currentState = this.data.hasInspired
    this.setData({ hasInspired: !currentState })

    try {
      if (api.toggleInspire) {
        await api.toggleInspire(this.data.articleId)
      }
      wx.showToast({
        title: !currentState ? '已点亮' : '已取消',
        icon: 'none'
      })
    } catch (err) {
      this.setData({ hasInspired: currentState })
      wx.showToast({ title: err.message || '操作失败', icon: 'none' })
    }
  },

  // 分享文章
  shareArticle() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShareAppMessage() {
    const article = this.data.article || {}
    return {
      title: article.title || 'Moti 之地 - 精选文章',
      path: '/pages/article/article?id=' + this.data.articleId,
      imageUrl: '/images/share-cover.png'
    }
  },

  onShareTimeline() {
    const article = this.data.article || {}
    return {
      title: article.title || 'Moti 之地 - 精选文章',
      imageUrl: '/images/share-cover.png'
    }
  },

  // 文本长按复制
  onTextLongPress(e) {
    const text = e.currentTarget.dataset.text
    this.setData({
      selectedText: text,
      showCopyPopup: true,
      copyPopupTop: e.detail.y - 80,
      copyPopupLeft: e.detail.x - 50
    })

    // 3秒后自动隐藏
    setTimeout(() => {
      this.setData({ showCopyPopup: false })
    }, 3000)
  },

  // 复制文本
  copyText() {
    wx.setClipboardData({
      data: this.data.selectedText,
      success: () => {
        this.setData({ showCopyPopup: false })
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  // 打开评论输入
  openCommentInput() {
    this.setData({
      showCommentInput: true,
      replyToComment: null,
      commentPreview: ''
    })
  },

  // 关闭评论输入
  closeCommentInput() {
    this.setData({ showCommentInput: false })
  },

  preventClose() {
    // 阻止事件冒泡
  },

  // 回复评论
  replyComment(e) {
    const commentId = e.currentTarget.dataset.id
    const comment = this.data.comments.find(c => c.id === commentId)
    if (comment) {
      this.setData({
        showCommentInput: true,
        replyToComment: comment,
        commentPreview: `回复 @${comment.author}：`
      })
    }
  },

  // 点赞评论
  async likeComment(e) {
    const commentId = e.currentTarget.dataset.id
    const commentIndex = this.data.comments.findIndex(c => c.id === commentId)

    if (commentIndex === -1) return

    const comment = this.data.comments[commentIndex]
    const isLiked = !comment.isLiked
    const likeCount = isLiked ? comment.likeCount + 1 : comment.likeCount - 1

    // 乐观更新
    this.setData({
      [`comments[${commentIndex}].isLiked`]: isLiked,
      [`comments[${commentIndex}].likeCount`]: likeCount
    })

    try {
      if (api.likeComment) {
        await api.likeComment(commentId)
      }
    } catch (err) {
      // 恢复状态
      this.setData({
        [`comments[${commentIndex}].isLiked`]: !isLiked,
        [`comments[${commentIndex}].likeCount`]: comment.likeCount
      })
    }
  },

  // 显示更多评论内容
  showMoreComment(e) {
    const commentId = e.currentTarget.dataset.id
    const commentIndex = this.data.comments.findIndex(c => c.id === commentId)

    if (commentIndex !== -1) {
      this.setData({
        [`comments[${commentIndex}].hasMore`]: false
      })
    }
  },

  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        console.log('选择的图片:', res.tempFiles[0].tempFilePath)
        wx.showToast({ title: '暂不支持图片', icon: 'none' })
      }
    })
  },

  // 显示表情
  showEmoji() {
    wx.showToast({ title: '表情功能开发中', icon: 'none' })
  },

  // 评论输入
  onCommentInput(e) {
    this.setData({
      commentText: e.detail.value
    })
  },

  // 提交评论
  async submitComment() {
    if (!app.checkLogin || !app.checkLogin()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }

    const { commentText } = this.data

    if (!commentText.trim()) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' })
      return
    }

    wx.showLoading({ title: '发送中...', mask: true })

    try {
      await api.addComment(this.data.articleId, commentText)

      wx.hideLoading()
      wx.showToast({ title: '评论成功', icon: 'success' })

      this.setData({
        commentText: '',
        showCommentInput: false
      })

      // 刷新评论列表
      this.setData({ commentsPage: 1, hasMoreComments: true })
      this.loadComments()

    } catch (err) {
      wx.hideLoading()
      wx.showToast({ title: err.message || '评论失败', icon: 'none' })
    }
  }
})
