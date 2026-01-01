Component({
  properties: {
    type: {
      type: String,
      value: 'primary' // primary | secondary | outline | text
    },
    size: {
      type: String,
      value: 'medium' // large | medium | small
    },
    block: {
      type: Boolean,
      value: false
    },
    disabled: {
      type: Boolean,
      value: false
    },
    loading: {
      type: Boolean,
      value: false
    },
    openType: String
  },

  methods: {
    onTap() {
      if (!this.properties.disabled) {
        this.triggerEvent('tap')
      }
    },
    onGetUserInfo(e) {
      this.triggerEvent('getuserinfo', e.detail)
    },
    onGetPhoneNumber(e) {
      this.triggerEvent('getphonenumber', e.detail)
    }
  }
})
