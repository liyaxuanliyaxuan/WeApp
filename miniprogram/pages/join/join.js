// pages/join/join.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: '',
    teamList: [],
    selected: "",

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
    db.collection('team').get().then(res => {

      // res.data 包含该记录的数据
      console.log(res.data)
      return res.data

    }).then(l => {
      console.log(l)
      that.setData({
        teamList: l
      })
    })}
    
    /*
    then(list => {
      var temp = new Array()
      for (let i = 0; i < 2; i++) {
        temp[i] = new Array();
        for (let j = 0; j < list.length / 2; j++) {
          temp[i][j] = list[i * 2 + j];
        }
      }
      return temp

    })*/

  ,

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
  onChange: function (event) {
    this.setData({
      inputValue: event.detail
    })
  },

  onCancel() {

  },

  addTeam() {
    wx.navigateTo({
      url: '../join_create/join_create',
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
  },

  addMember() {
    wx.navigateTo({
      url: '../join_create/join_create',
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
  },

  onSearch(e) {
    const that = this
    console.log(e.detail)
    let searchName = e.detail
    const db = wx.cloud.database()
    db.collection('team').where({
      name: searchName,
    }).get().then(res => {

      // res.data 包含该记录的数据
      //console.log(res.data)

      return res.data[0].leader

    }
    ).then(l => {
      that.setData({
        teamShow: l
      })


    })

  },
  chooseTeam(e) {
    console.log(e)
    console.log(e.target.dataset.name)
    this.setData({
      selected: e.target.dataset.name
    })


    // wx.navigateTo({
    // url: '../team_info/team_info',
    //})

  },
  enterTeam() {
    wx.navigateTo({
      url: '../team_info/team_info',
    })
  }
  ,
  enterIndex() {
    wx.navigateTo({
      url: '../index/index',
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