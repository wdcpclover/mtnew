Component({
  properties: {
    icon: String,
    title: String,
    value: String,
    showArrow: {
      type: Boolean,
      value: true
    },
    showSwitch: {
      type: Boolean,
      value: false
    },
    switchValue: {
      type: Boolean,
      value: false
    },
    border: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap')
    },
    onSwitchChange(e) {
      this.triggerEvent('switch', { value: e.detail.value })
    }
  }
})
