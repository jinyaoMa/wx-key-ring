// pages/auth/auth.js

const AUTH_CONTENT = '机主已有指纹录入，继续操作需解锁'

Page({
  data: {
    hasExit: false,
    textClose: '结束小程序'
  },
  onLoad(options) {
    wx.checkIsSupportSoterAuthentication({
      success: res => {
        if (res.supportMode.includes('fingerPrint')) {
          wx.checkIsSoterEnrolledInDevice({
            checkAuthMode: 'fingerPrint',
            success: res => {
              if (res.isEnrolled) {
                wx.startSoterAuthentication({
                  challenge: Date.now().toString(),
                  requestAuthModes: ['fingerPrint'],
                  authContent: AUTH_CONTENT,
                  success: () => {
                    wx.switchTab({
                      url: '../index/index'
                    })
                  },
                  fail: () => {
                    this.setData({
                      hasExit: true
                    })
                  }
                })
              } else {
                wx.switchTab({
                  url: '../index/index'
                })
              }
            }
          })
        } else {
          wx.switchTab({
            url: '../index/index'
          })
        }
      },
      fail: () => {
        wx.switchTab({
          url: '../index/index'
        })
      }
    })
  }
})