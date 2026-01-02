Component({
  properties: {
    current: {
      type: Number,
      value: 0
    }
  },

  data: {
    theme: 'light'
  },

  attached() {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      theme: systemInfo.theme || 'light'
    })

    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },

  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset
      if (index === this.properties.current) return

      wx.switchTab({ url })
    }
  }
})
