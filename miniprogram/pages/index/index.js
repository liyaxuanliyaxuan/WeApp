//index.js
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    openID:"",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    logo:""
  },
  //事件处理函数
  bindViewTap: function () {
    const that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openId: app.globalData.openid
        })
        console.log('55',this.data.openId)
        const db = wx.cloud.database()
        db.collection('member').where({
          _openid: this.data.openId,
        })
          .get({
            success: res => {
              console.log('调用成功')
              console.log('res.data',res.data)
              if (res.data.length == 0) {
                console.log('该用户不存在，需要创建')
                wx.navigateTo({
                  url: '/pages/me_create/me_create'
                })
              }
              else {
                //修改存储用户头像
                const db = wx.cloud.database()
                console.log('id:', res.data[0]._id)
                console.log(that.data.userInfo.avatarUrl)
                wx.cloud.callFunction({
                  name: "me_edit",
                  data: {
                    id: res.data[0]._id,
                    logo: that.data.userInfo.avatarUrl,
                  },
                  success: console.log('success'),
                  fail: console.log('fail')
                })
                /**
                wx.navigateTo({
                  url: '/pages/record_write/record_write',
                })
                */
                wx.switchTab({
                  url: '/pages/join/join'
                })
              }

              //console.log(res.data.length)
            }
          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log(this.data.userInfo)
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(this.data.userInfo)
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
          console.log(this.data.userInfo)
        }
      })
    }

    //console.log(app.globalData.userInfo)
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
