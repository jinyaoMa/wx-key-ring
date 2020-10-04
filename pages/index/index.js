//index.js

const util = require("../../utils/util")

const app = getApp()

const LOADING_IMPORT = '导入中'

const LOADING_EXPORT = '导出中'

const MODAL_DELETE_TITLE = '确定删除此帐号吗？'

const MODAL_EXPORT_CONFIRM = '打开文件'

Page({
  data: {
    imgPlus: '../../images/plus.png',
    textEmpty: 'N/A',
    textUsernameLabel: '帐号',
    btnImport: '导入记录',
    btnExport: '导出记录',
    hintAdd: '请按右下角 “+” 号添加记录',
    keys: [],
    toastTitleFailImport: '导入失败',
    toastTitleSuccessImport: '导入成功',
    modalTitleSuccessExport: '导出成功',
    modalContentSuccessExport: '数据所在路径',
    toastTitleFailExport: '导出失败'
  },
  onLoad() {
    this.getKeys()
  },
  getKeys() {
    if (app.globalData.keys) {
      this.setData({
        keys: app.globalData.keys
      })
    } else if (app.globalData.userInfoEnc) {
      wx.getStorage({
        key: 'keys',
        success: res => {
          let keys = util.aes2obj(res.data, app.globalData.userInfoEnc)
          app.globalData.keys = keys
          this.setData({
            keys
          })
        }
      })
    } else if (app.globalData.userInfo) {
      let userInfoEnc = util.obj2md5(app.globalData.userInfo)
      app.globalData.userInfoEnc = userInfoEnc
      this.getKeys()
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          let userInfoEnc = util.obj2md5(res.userInfo)
          app.globalData.userInfoEnc = userInfoEnc
          this.getKeys()
        },
        fail: () => {
          let userInfoEnc = util.obj2md5(app.globalData.userInfo)
          app.globalData.userInfoEnc = userInfoEnc
          this.getKeys()
        }
      })
    }
  },
  bindAddKeyTap() {
    wx.navigateTo({
      url: '../add/add',
      events: {
        updateKeys: key => {
          let keys = this.data.keys
          keys.unshift(key)
          this.setData({
            keys
          })
          app.globalData.keys = keys
          wx.setStorage({
            data: util.obj2aes(keys, app.globalData.userInfoEnc),
            key: 'keys',
          })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  bindCardTap(e) {
    const cDataset = e.currentTarget.dataset
    const tDataset = e.target.dataset
    let index = -1
    if (typeof cDataset.index !== 'undefined') {
      index = cDataset.index
    } else if (typeof tDataset.index !== 'undefined') {
      index = tDataset.index
    }
    wx.navigateTo({
      url: `../detail/detail?index=${index}`,
      events: {
        updateKey: (data) => {
          if (data.index >= 0) {
            const keys = this.data.keys.concat()
            keys[data.index].aria = data.key.aria
            keys[data.index].username = data.key.username
            keys[data.index].password = data.key.password
            keys[data.index].more = data.key.more
            this.setData({
              keys
            })
            app.globalData.keys = keys
            wx.setStorage({
              data: util.obj2aes(keys, app.globalData.userInfoEnc),
              key: 'keys',
            })
            wx.navigateBack({
              delta: 1
            })
          }
        },
        deleteKey: index => {
          const keys = this.data.keys.concat()
          if (index >= 0 && index < keys.length) {
            wx.showModal({
              title: MODAL_DELETE_TITLE,
              content: keys[index].username,
              confirmColor: '#993333',
              success: res => {
                if (res.confirm) {
                  keys.splice(index, 1)
                  this.setData({
                    keys
                  })
                  app.globalData.keys = keys
                  wx.setStorage({
                    data: util.obj2aes(keys, app.globalData.userInfoEnc),
                    key: 'keys',
                  })
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            });
          }
        }
      }
    })
  },
  bindBtnExportTap() {
    const filePath = `${wx.env.USER_DATA_PATH}/keyrings.${Date.now()}.xlsx`
    const fs = wx.getFileSystemManager()
    wx.showLoading({
      title: LOADING_EXPORT,
    })
    fs.writeFile({
      filePath,
      encoding: 'binary',
      data: util.json2xlsx(this.data.keys),
      success: _ => {
        wx.hideLoading({
          complete: () => {
            wx.showModal({
              title: this.data.modalTitleSuccessExport,
              content: this.data.modalContentSuccessExport + '\n' + filePath,
              showCancel: false,
              confirmText: MODAL_EXPORT_CONFIRM,
              success: res => {
                if (res.confirm) {
                  wx.openDocument({
                    filePath
                  })
                }
              }
            })
          },
        })()
      },
      fail: () => {
        wx.hideLoading({
          complete: () => {
            wx.showToast({
              title: this.data.toastTitleFailExport,
              icon: 'none'
            })
          },
        })
      }
    })
  },
  bindBtnImportTap() {
    wx.showLoading({
      title: LOADING_IMPORT,
    })
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['xlsx'],
      success: res => {
        if (/\.xlsx$/i.test(res.tempFiles[0].path)) {
          const filePath = res.tempFiles[0].path
          const fs = wx.getFileSystemManager()
          fs.readFile({
            filePath,
            encoding: 'binary',
            success: res => {
              try {
                let keys = util.xlsx2json(res.data)
                app.globalData.keys = keys
                this.setData({
                  keys
                })
                wx.setStorage({
                  data: util.obj2aes(keys, app.globalData.userInfoEnc),
                  key: 'keys',
                })
                wx.hideLoading({
                  complete: () => {
                    wx.showToast({
                      title: this.data.toastTitleSuccessImport
                    })
                  }
                })
              } catch (error) {
                wx.hideLoading({
                  complete: () => {
                    wx.showToast({
                      title: this.data.toastTitleFailImport,
                      icon: 'none'
                    })
                  }
                })
              }
            },
            fail: () => {
              wx.hideLoading({
                complete: () => {
                  wx.showToast({
                    title: this.data.toastTitleFailImport,
                    icon: 'none'
                  })
                }
              })
            }
          })
        } else {
          wx.hideLoading({
            complete: () => {
              wx.showToast({
                title: this.data.toastTitleFailImport,
                icon: 'none'
              })
            }
          })
        }
      },
      fail: () => {
        wx.hideLoading()
      }
    })
    wx.switchTab({
      url: 'index'
    })
  }
})