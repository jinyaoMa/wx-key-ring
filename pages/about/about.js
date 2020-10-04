//about.js

const util = require("../../utils/util")

const app = getApp()

const APP_PRINT = '用户密钥'
const APP_PRINT_DEFAULT = '默认密钥'

const LOADING_PRINT = '生成中'
const TOAST_SUCCESS = '生成成功'
const TOAST_FAIL = '使用默认密钥'

Page({
  data: {
    appIcon: '../../images/ysk.png',
    appName: '耀匙扣',
    appAuthor: '由 jinyaoMa 制作',
    appDesc: '一款类似钥匙扣APP的小程序；辅助储存账号密码；加密数据使用本地化离线操作。',
    appPrint: APP_PRINT,
    appVer: '版本号 20200926.1425',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    btnGetUserInfo: '生成用户密钥'
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        appPrint: `${APP_PRINT} ${util.obj2md5(app.globalData.userInfo)}`,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback4About = res => {
        this.setData({
          appPrint: `${APP_PRINT} ${util.obj2md5(res.userInfo)}`,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          let userInfoEnc = util.obj2md5(res.userInfo)
          app.globalData.userInfo = res.userInfo
          app.globalData.userInfoEnc = userInfoEnc
          this.setData({
            appPrint: `${APP_PRINT} ${userInfoEnc}`,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    wx.showLoading({
      title: LOADING_PRINT,
    })
    wx.getStorage({
      key: 'keys',
      success: res => {
        const keys = util.aes2obj(res.data, app.globalData.userInfoEnc)
        const newUserInfoEnc = util.obj2md5(e.detail.userInfo || null)
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.userInfoEnc = newUserInfoEnc
        app.globalData.keys = keys
        this.setData({
          appPrint: `${!e.detail.userInfo ? APP_PRINT_DEFAULT : APP_PRINT} ${newUserInfoEnc}`,
          hasUserInfo: true
        })
        wx.setStorage({
          data: util.obj2aes(keys, newUserInfoEnc),
          key: 'keys'
        })
        wx.hideLoading({
          complete: () => {
            wx.showToast({
              title: TOAST_SUCCESS
            })
          }
        })
      },
      fail: () => {
        const keys = []
        const newUserInfoEnc = util.obj2md5(e.detail.userInfo || null)
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.userInfoEnc = newUserInfoEnc
        app.globalData.keys = keys
        this.setData({
          appPrint: `${!e.detail.userInfo ? APP_PRINT_DEFAULT : APP_PRINT} ${newUserInfoEnc}`,
          hasUserInfo: true
        })
        wx.setStorage({
          data: util.obj2aes(keys, newUserInfoEnc),
          key: 'keys'
        })
        wx.hideLoading({
          complete: () => {
            wx.showToast({
              title: TOAST_FAIL
            })
          }
        })
      },
    })
  }
})