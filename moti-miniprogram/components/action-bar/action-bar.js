Component({
  properties: {
    liked: {
      type: Boolean,
      value: false
    },
    bookmarked: {
      type: Boolean,
      value: false
    },
    likeCount: Number,
    bookmarkCount: Number,
    commentCount: Number
  },

  methods: {
    onLike() {
      this.triggerEvent('like')
    },
    onBookmark() {
      this.triggerEvent('bookmark')
    },
    onComment() {
      this.triggerEvent('comment')
    },
    onShare() {
      this.triggerEvent('share')
    }
  }
})
