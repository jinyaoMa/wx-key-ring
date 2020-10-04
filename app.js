//app.js

App({
  globalData: {
    userInfo: null,
    userInfoEnc: null,
    keys: null
  },
  onLaunch() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo

              if (this.userInfoReadyCallback4About) {
                this.userInfoReadyCallback4About(res)
              }
            }
          })
        }
      }
    })
  }
})