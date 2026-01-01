Component({
  properties: {
    article: {
      type: Object,
      value: {}
    },
    showCover: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onTap() {
      const { tid, pid } = this.properties.article
      const id = tid || pid
      if (id) {
        wx.navigateTo({
          url: `/pages/article/article?id=${id}`
        })
      }
    }
  }
})
