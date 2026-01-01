Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: String,
    content: String,
    showCancel: {
      type: Boolean,
      value: true
    },
    cancelText: {
      type: String,
      value: '取消'
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    closeOnOverlay: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onOverlayTap() {
      if (this.properties.closeOnOverlay) {
        this.triggerEvent('close')
      }
    },
    preventClose() {},
    onCancel() {
      this.triggerEvent('cancel')
      this.triggerEvent('close')
    },
    onConfirm() {
      this.triggerEvent('confirm')
    }
  }
})
