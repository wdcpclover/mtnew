Component({
  properties: {
    status: {
      type: String,
      value: 'loading' // loading | empty | error
    },
    loadingText: {
      type: String,
      value: '加载中...'
    },
    emptyText: {
      type: String,
      value: '暂无数据'
    },
    errorText: {
      type: String,
      value: '加载失败'
    }
  },

  methods: {
    onRetry() {
      this.triggerEvent('retry')
    }
  }
})
