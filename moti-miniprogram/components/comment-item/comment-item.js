Component({
  properties: {
    comment: {
      type: Object,
      value: {}
    }
  },

  methods: {
    onLike() {
      this.triggerEvent('like', { comment: this.properties.comment })
    },
    onReply() {
      this.triggerEvent('reply', { comment: this.properties.comment })
    }
  }
})
