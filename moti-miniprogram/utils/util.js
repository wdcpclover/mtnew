// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 显示提示
const showToast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

// 显示加载
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title,
    mask: true
  })
}

// 隐藏加载
const hideLoading = () => {
  wx.hideLoading()
}

// 跳转页面
const navigateTo = (url) => {
  wx.navigateTo({ url })
}

// 返回上一页
const navigateBack = () => {
  wx.navigateBack()
}

// 切换 Tab
const switchTab = (url) => {
  wx.switchTab({ url })
}

// 重定向
const redirectTo = (url) => {
  wx.redirectTo({ url })
}

// 获取系统信息
const getSystemInfo = () => {
  return wx.getSystemInfoSync()
}

// 获取状态栏高度
const getStatusBarHeight = () => {
  const systemInfo = getSystemInfo()
  return systemInfo.statusBarHeight
}

// 获取导航栏高度（包含状态栏）
const getNavBarHeight = () => {
  const statusBarHeight = getStatusBarHeight()
  const menuButton = wx.getMenuButtonBoundingClientRect()
  const navBarHeight = (menuButton.top - statusBarHeight) * 2 + menuButton.height
  return statusBarHeight + navBarHeight
}

// rpx 转 px
const rpxToPx = (rpx) => {
  const systemInfo = getSystemInfo()
  return rpx * systemInfo.windowWidth / 750
}

// 防抖
const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// 节流
const throttle = (fn, delay = 300) => {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      fn.apply(this, args)
      last = now
    }
  }
}

module.exports = {
  formatTime,
  showToast,
  showLoading,
  hideLoading,
  navigateTo,
  navigateBack,
  switchTab,
  redirectTo,
  getSystemInfo,
  getStatusBarHeight,
  getNavBarHeight,
  rpxToPx,
  debounce,
  throttle
}
