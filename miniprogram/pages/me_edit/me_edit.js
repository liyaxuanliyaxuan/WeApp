// pages/me_edit/me_edit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    member: {},
    show: false,
    realName: "",
    date: "",
    job: "",
    signature: "",
    pic:"",
    id:"",
  },
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
        }).then(pic => {
          console.log('pic:', pic)
          that.setData({
            pic: pic
          })
          wx.cloud.downloadFile({
            fileID: pic
          }).then(res => {
            // get temp file path
            console.log(res.tempFilePath)
            return res.tempFilePath
          }).then(id => {
            console.log('id:',id)
            that.setData({
              id: id
            })
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  showtip: function () {
    const that = this
    console.log('member:',this.data.member._id)
    //上传数据
    if (this.data.realName == '') {
      wx: wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none',
      })
      return false
    }
    //修改
    const db = wx.cloud.database()
    console.log('member:', that.data.realName)
    //将个人信息写入团队
    wx.cloud.callFunction({
      name: "me_edit",
      data: {
        id: that.data.member._id,
        realName: that.data.realName,
        date: that.data.date,
        job: that.data.job,
        pic:that.data.pic,
        signature: that.data.signature,
      },
      success: console.log('success'),
      fail: console.log('fail')
    })
    wx.showModal({
      content: '保存成功',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          wx.switchTab({
            url: '/pages/me/me'
          })
        }
        else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    console.log('date:', this.data.date)
  },
  change1(e) {
    this.setData({
      realName: e.detail
    })
    console.log('realName:', this.data.realName)
  },
  change2(e) {
    this.setData({
      date: e.detail
    })
    console.log('date', this.data.date)
  },
  change3(e) {
    this.setData({
      job: e.detail
    })
    console.log('job:', this.data.job)
  },
  change4(e) {
    this.setData({
      signature: e.detail
    })
    console.log('signature:', this.data.signature)
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
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
          openid: this.data.openid,
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
                that.setData({
                  realName: that.data.member.realName,
                  date:that.data.member.date,
                  job: that.data.member.job,
                  signature: that.data.member.signature,
                  pic:that.data.member.pic
                })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this
    const db = wx.cloud.database()
    db.collection('member').where({
      _openid: 'xxx' // 填入当前用户 openid
    }).get().then(res => {
      console.log(res.data)
    })
  },

  onChange: function (event) {
    this.setData({
      inputValue: event.detail
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

  }
})