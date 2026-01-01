Component({
  properties: {
    current: {
      type: Number,
      value: 0
    }
  },

  methods: {
    switchTab(e) {
      const { index, url } = e.currentTarget.dataset
      if (index === this.properties.current) return

      wx.switchTab({ url })
    }
  }
})
