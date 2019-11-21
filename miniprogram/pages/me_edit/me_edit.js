// pages/me_edit/me_edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    date: "2000-01-01",
    inputValue: '',
    a: true,
    person: {},
    userInfo: {},
  },

  showtip: function () {
    wx.showModal({
      content: '保存成功',
      success(res) {
        if (res.confirm) {
          console.log('确定'),
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

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },

  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  bindReplaceInput: function (e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    var left
    if (pos !== -1) {
      // 光标在中间
      left = e.detail.value.slice(0, pos)
      // 计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }

    // 或者直接返回字符串,光标在最后边
    // return value.replace(/11/g,'2'),
  },

  bindHideKeyboard: function (e) {
    if (e.detail.value === '123') {
      // 收起键盘
      wx.hideKeyboard()
    }
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
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