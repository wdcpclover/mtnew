/**
 * 登录页面 - 完整登录流程
 *
 * 流程说明:
 *
 * 【手机号登录流程】
 * login1 -> login2 -> login3 -> login6(新用户)
 *
 * 【微信登录流程】
 * login1 -> login4 -> [微信系统弹窗] -> login5 -> login6(新用户)
 *
 * 页面状态说明:
 * login1: 主入口 - 选择登录方式（手机号/微信）
 * login2: 手机号输入 - 输入手机号
 * login3: 验证码输入 - 输入6位验证码
 * login4: 微信授权确认 - 点击后触发微信获取手机号弹窗(设计稿中的"登录3")
 * login5: 用户信息授权 - 获取昵称头像
 * login6: 完善信息 - 设置昵称（新用户）
 */

const app = getApp()

// 登录状态流转
const LOGIN_FLOW = {
  // 手机号登录流程
  phone: ['login1', 'login2', 'login3', 'login6'],
  // 微信登录流程
  wechat: ['login1', 'login4', 'login5', 'login6']
}

Page({
  data: {
    darkMode: false,
    statusBarHeight: 0,
    canGoBack: false,
    loading: false,

    // 当前登录状态
    loginState: 'login1',
    loginType: '', // 'phone' | 'wechat'

    // 手机号登录
    phone: '',
    phoneDisplay: '',

    // 验证码
    code: '',
    codeFocus: false,
    countdown: 0,

    // 用户信息
    userInfo: {
      avatar: '',
      nickname: ''
    },

    // 错误提示
    errorMsg: '',

    // 登录按钮是否可用
    canLogin: false
  },

  onLoad(options = {}) {
    const systemInfo = wx.getSystemInfoSync()
    const pages = getCurrentPages()

    this.setData({
      darkMode: app.globalData.darkMode || false,
      statusBarHeight: systemInfo.statusBarHeight,
      canGoBack: pages.length > 1,
      loginState: options.state || 'login1'
    })

    // 如果已登录，直接跳转首页
    if (app.globalData.isLoggedIn) {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  onUnload() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },

  // ==================== 导航 ====================

  handleBack() {
    const { loginState, loginType } = this.data
    const flow = LOGIN_FLOW[loginType] || LOGIN_FLOW.phone
    const currentIndex = flow.indexOf(loginState)

    if (currentIndex > 0) {
      // 返回上一步
      const prevState = flow[currentIndex - 1]
      this.setData({
        loginState: prevState,
        code: '',
        codeFocus: false
      })
    } else if (loginState !== 'login1') {
      // 如果不在流程中，返回主入口
      this.setData({ loginState: 'login1', loginType: '' })
    } else {
      // 返回上一页或首页
      wx.navigateBack({
        fail: () => wx.switchTab({ url: '/pages/index/index' })
      })
    }
  },

  // ==================== login1: 主入口 ====================

  // 选择手机号登录
  goPhoneLogin() {
    this.setData({
      loginState: 'login2',
      loginType: 'phone'
    })
  },

  // 选择微信登录
  goWechatAuth() {
    this.setData({
      loginState: 'login4',
      loginType: 'wechat'
    })
  },

  // ==================== login2: 手机号输入 ====================

  onPhoneInput(e) {
    const phone = e.detail.value
    const code = this.data.code
    this.setData({
      phone,
      errorMsg: '',
      canLogin: phone.length === 11 && code.length === 6
    })
  },

  onCodeInput(e) {
    const code = e.detail.value
    const phone = this.data.phone
    this.setData({
      code,
      errorMsg: '',
      canLogin: phone.length === 11 && code.length === 6
    })
  },

  clearPhone() {
    this.setData({ phone: '', canLogin: false })
  },

  // 发送验证码
  async sendCode() {
    const { phone, countdown } = this.data

    // 倒计时中不能重复发送
    if (countdown > 0) return

    // 验证手机号格式
    if (phone.length !== 11 || !/^1[3-9]\d{9}$/.test(phone)) {
      this.setData({ errorMsg: '无效的手机号' })
      return
    }

    try {
      wx.showLoading({ title: '发送中...' })

      // TODO: 调用发送验证码接口
      // await api.sendSmsCode(phone)

      // 模拟发送成功
      await this.sleep(500)

      wx.hideLoading()

      this.setData({
        countdown: 60,
        errorMsg: ''
      })

      this.startCountdown()

      wx.showToast({ title: '验证码已发送', icon: 'success' })

    } catch (err) {
      wx.hideLoading()
      console.error('发送验证码失败:', err)
      wx.showToast({ title: err.message || '发送失败', icon: 'none' })
    }
  },

  // ==================== login3: 验证码相关 ====================

  focusCodeInput() {
    this.setData({ codeFocus: true })
  },

  onCodeFocus() {
    this.setData({ codeFocus: true })
  },

  onCodeBlur() {
    this.setData({ codeFocus: false })
  },

  resendCode() {
    if (this.data.countdown > 0) return
    this.setData({ loginState: 'login2' })
  },

  startCountdown() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }

    this.countdownTimer = setInterval(() => {
      const { countdown } = this.data
      if (countdown <= 1) {
        clearInterval(this.countdownTimer)
        this.setData({ countdown: 0 })
      } else {
        this.setData({ countdown: countdown - 1 })
      }
    }, 1000)
  },

  // 提交手机号登录
  async submitPhoneLogin() {
    const { phone, code } = this.data

    if (code.length !== 6) {
      this.setData({ errorMsg: '请输入6位验证码' })
      return
    }

    this.setData({ loading: true, errorMsg: '' })

    try {
      // TODO: 调用验证码登录接口
      // const result = await api.loginWithCode(phone, code)

      // 模拟登录
      await this.sleep(800)

      // 模拟验证码错误场景（测试时可改为 true）
      const isCodeError = false
      if (isCodeError) {
        this.setData({
          loading: false,
          errorMsg: '验证码错误，请重新尝试'
        })
        return
      }

      const result = {
        token: 'phone_token_' + Date.now(),
        user: { id: 1, phone },
        isNewUser: true // 是否新用户
      }

      this.setData({ loading: false })

      if (result.isNewUser) {
        // 新用户，去完善信息
        this.setData({
          loginState: 'login6',
          userInfo: { ...this.data.userInfo, phone }
        })
      } else {
        // 老用户，直接登录成功
        this.onLoginSuccess(result)
      }

    } catch (err) {
      this.setData({ loading: false })
      console.error('手机号登录失败:', err)
      this.setData({ errorMsg: err.message || '验证码错误，请重新尝试' })
    }
  },

  // ==================== login4: 微信授权确认 ====================

  cancelWechatAuth() {
    this.setData({
      loginState: 'login1',
      loginType: ''
    })
  },

  // 微信获取手机号回调 (登录3弹窗授权后)
  async onGetPhoneNumber(e) {
    console.log('getPhoneNumber result:', e.detail)

    // 用户拒绝授权
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      console.log('用户拒绝授权手机号')
      wx.showToast({ title: '需要授权手机号才能登录', icon: 'none' })
      return
    }

    // 用户同意授权，获取到加密数据
    const { code, encryptedData, iv } = e.detail

    if (this.data.loading) return
    this.setData({ loading: true })

    try {
      // 先获取微信登录code
      const loginRes = await this.wxLogin()

      // TODO: 调用后端接口，传递 code, encryptedData, iv 来解密手机号并登录
      // const result = await api.wechatPhoneLogin({
      //   loginCode: loginRes.code,
      //   phoneCode: code,
      //   encryptedData,
      //   iv
      // })

      // 模拟登录成功
      await this.sleep(800)
      const result = {
        token: 'wechat_phone_token_' + Date.now(),
        user: { id: 1, phone: '135****2025' },
        isNewUser: true,
        hasUserInfo: false
      }

      this.setData({ loading: false })

      if (!result.hasUserInfo) {
        // 需要获取用户信息
        this.setData({ loginState: 'login5' })
      } else if (result.isNewUser) {
        // 新用户，去完善信息
        this.setData({ loginState: 'login6' })
      } else {
        // 老用户，直接登录成功
        this.onLoginSuccess(result)
      }

    } catch (err) {
      this.setData({ loading: false })
      console.error('微信手机号登录失败:', err)
      wx.showToast({ title: err.message || '登录失败', icon: 'none' })
    }
  },

  // 微信登录 (旧方式，保留兼容)
  async handleWechatLogin() {
    if (this.data.loading) return

    this.setData({ loading: true })

    try {
      // 获取微信登录 code
      const loginRes = await this.wxLogin()

      // TODO: 调用后端微信登录接口
      // const result = await api.wechatLogin(loginRes.code)

      // 模拟登录
      await this.sleep(800)
      const result = {
        token: 'wechat_token_' + Date.now(),
        user: { id: 1 },
        isNewUser: true,
        hasUserInfo: false
      }

      if (!result.hasUserInfo) {
        // 需要获取用户信息
        this.setData({
          loginState: 'login5',
          loading: false
        })
      } else if (result.isNewUser) {
        // 新用户，去完善信息
        this.setData({
          loginState: 'login6',
          loading: false
        })
      } else {
        // 老用户，直接登录成功
        this.setData({ loading: false })
        this.onLoginSuccess(result)
      }

    } catch (err) {
      this.setData({ loading: false })
      console.error('微信登录失败:', err)
      wx.showToast({ title: err.message || '登录失败', icon: 'none' })
    }
  },

  // ==================== login5: 用户信息授权 ====================

  // 选择头像回调
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl

    this.setData({
      'userInfo.avatar': avatarUrl,
      loginState: 'login6'
    })
  },

  skipUserInfo() {
    this.setData({ loginState: 'login6' })
  },

  // ==================== login6: 完善信息 ====================

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ 'userInfo.avatar': tempFilePath })
      }
    })
  },

  onNicknameInput(e) {
    this.setData({ 'userInfo.nickname': e.detail.value })
  },

  async completeProfile() {
    const { userInfo } = this.data

    if (!userInfo.nickname || !userInfo.nickname.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    try {
      wx.showLoading({ title: '保存中...' })

      // TODO: 调用更新用户信息接口
      // await api.updateUserInfo(userInfo)

      // 模拟保存
      await this.sleep(500)

      const result = {
        token: wx.getStorageSync('token') || 'new_token_' + Date.now(),
        user: {
          id: 1,
          nickname: userInfo.nickname.trim(),
          avatar: userInfo.avatar
        }
      }

      wx.hideLoading()
      this.onLoginSuccess(result)

    } catch (err) {
      wx.hideLoading()
      console.error('保存用户信息失败:', err)
      wx.showToast({ title: err.message || '保存失败', icon: 'none' })
    }
  },

  // ==================== 通用方法 ====================

  wxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            resolve(res)
          } else {
            reject(new Error('获取登录凭证失败'))
          }
        },
        fail: reject
      })
    })
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },

  onLoginSuccess(result) {
    // 保存登录状态
    app.globalData.isLoggedIn = true
    app.globalData.userInfo = result.user

    // 保存到本地存储
    wx.setStorageSync('token', result.token)
    wx.setStorageSync('userInfo', result.user)

    wx.showToast({ title: '登录成功', icon: 'success' })

    // 跳转首页
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 1000)
  },

  handleSkip() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  showUserAgreement() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=agreement&title=用户协议',
      fail: () => {
        wx.showModal({
          title: '用户协议',
          content: '用户协议内容完善中...',
          showCancel: false
        })
      }
    })
  },

  showPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/webview/webview?url=privacy&title=隐私政策',
      fail: () => {
        wx.showModal({
          title: '隐私政策',
          content: '隐私政策内容完善中...',
          showCancel: false
        })
      }
    })
  }
})
