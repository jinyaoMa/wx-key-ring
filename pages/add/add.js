// pages/add/add.js

Page({
  data: {
    labelAria: '别名',
    placeholderAria: '别名可用于备注帐号',
    labelUsername: '账号',
    placeholderUsername: '请输入需要记录的帐号',
    labelPassword: '密码',
    placeholderPassword: '请输入需要记录的密码',
    labelMore: '填写更多信息',
    placeholderMore: '密保问题、登记邮箱、密码历史等',
    btnConfirm: '确定',
    btnCancel: '放弃',
    aria: '',
    username: '',
    password: '',
    more: ''
  },
  bindAriaBlur(e) {
    this.setData({
      aria: e.detail.value
    })
  },
  bindUsernameBlur(e) {
    this.setData({
      username: e.detail.value
    })
  },
  bindPasswordBlur(e) {
    this.setData({
      password: e.detail.value
    })
  },
  bindMoreBlur(e) {
    this.setData({
      more: e.detail.value
    })
  },
  bindBtnCancelTap() {
    wx.navigateBack({
      delta: 1
    })
  },
  bindBtnConfirmTap() {
    const key = {
      id: Date.now(),
      aria: this.data.aria.trim(),
      username: this.data.username.trim(),
      password: this.data.password.trim(),
      more: this.data.more
    }
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('updateKeys', key)
  }
})