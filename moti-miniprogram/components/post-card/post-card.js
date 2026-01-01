Component({
  properties: {
    post: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onTap() {
      const { tid, pid } = this.properties.post
      const id = tid || pid
      if (id) {
        wx.navigateTo({
          url: `/pages/article/article?id=${id}`
        })
      }
    }
  }
})
