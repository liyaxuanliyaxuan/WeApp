// pages/me/me.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    userInfo:{},
    member:{},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  
  },
  
  getUserInfo: function (e) {
    console.log(5);
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    } else {
      this.openSetting();
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 上传图片
   */
  // 上传图片
  doUpload: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
        }).then(res => {
          console.log('[上传文件] 成功：', res)
          wx.hideLoading()
          return res.fileID
        }).then(id => {
          console.log('id', id)
          that.setData({
            id: id
          })
          wx.cloud.downloadFile({
            fileID: id
          }).then(res => {
            // get temp file path
            console.log(res.tempFilePath)
            console.log('fileID', id)
            return res.tempFilePath
          }).then(pic => {
            that.setData({
              pic: pic
            })
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this

    //厨师帽图片在这里
    wx.cloud.downloadFile({
      fileID: 'cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image0.33074095106783985.png'
    }).then(res => {
      // get temp file path
      console.log(res.tempFilePath)
    }).catch(error => {
      // handle error
    })

    //获取userInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log('1', this.data.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log('2', this.data.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log(res.userInfo)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log('3', this.data.userInfo)
        }
      })
    }
      //存储openId
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          this.setData({
            openid: app.globalData.openid
          })
          console.log(this.data.openid)
          const db = wx.cloud.database()

          //根据openid获得其他信息
          db.collection('member').where({
            _openid: this.data.openid,
          })
            .get({
              success: res => {
                //console.log('调用成功')
                console.log(res.data)
                console.log(res.data[0].realName)
                if (res.data.length == 0) {
                  console.log('调取失败')
                }
                else {
                  console.log('调用成功')
                  console.log('again', res.data[0].realName)
                  let temp = res.data[0]
                  that.setData({
                    member: temp
                  })
                  console.log(that.data.member.realName)
                }
              }
            })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  editMe() {
    wx.navigateTo({
      url: '../me_edit/me_edit',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})