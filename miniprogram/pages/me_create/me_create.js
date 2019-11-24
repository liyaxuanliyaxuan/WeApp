// pages/me_edit/me_edit.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    _openId:"",
    realName:"",
    date: "",
    job:"",
    signature:"",
  },

  showtip: function () {
    const that = this
    //存储openId
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          _openId: app.globalData.openid
        })
        console.log(app.globalData.openid)
        console.log(this.data._openId)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    //上传数据
    const newName = this.data.realName
    const newDate = this.data.date
    const newJob = this.data.job
    const newSignature  = this.data.signature
    const newId = this.data._openId
    const newMember = {
      newName,
      newDate,
      newJob,
      newSignature,
      newId
    }
    if (newName == '') {
      wx: wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none',
      })
      return false
    }
    //添加
    const db = wx.cloud.database()
    db.collection('member').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        realName: that.data.realName,
        date: that.data.date,
        job: that.data.job,
        signature: that.data.signature,
        openid:that.data._openId
      }
    }).then(res => {
      console.log(res)
    })
    
    wx.showModal({
      content: '保存成功',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          wx.switchTab({
            url: '/pages/join/join'
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
    console.log('realName:',this.data.realName)
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