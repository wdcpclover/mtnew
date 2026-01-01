Component({
  properties: {
    value: String,
    type: {
      type: String,
      value: 'text'
    },
    password: {
      type: Boolean,
      value: false
    },
    placeholder: String,
    icon: String,
    clearable: {
      type: Boolean,
      value: true
    },
    maxlength: {
      type: Number,
      value: 140
    },
    autoFocus: {
      type: Boolean,
      value: false
    },
    error: {
      type: Boolean,
      value: false
    }
  },

  data: {
    focus: false
  },

  methods: {
    onInput(e) {
      this.triggerEvent('input', { value: e.detail.value })
    },
    onFocus() {
      this.setData({ focus: true })
      this.triggerEvent('focus')
    },
    onBlur() {
      this.setData({ focus: false })
      this.triggerEvent('blur')
    },
    onConfirm(e) {
      this.triggerEvent('confirm', { value: e.detail.value })
    },
    onClear() {
      this.triggerEvent('input', { value: '' })
      this.triggerEvent('clear')
    }
  }
})
