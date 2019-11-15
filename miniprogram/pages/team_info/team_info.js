// pages/team_info/team_info.js
import store from "../../utils/store.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active:2,
    currentTeamName:"",
    teamInfo:{}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const temp = store.dataFromTeam.currentTeamName
    // console.log(store.dataFromTeam.currentTeamName)
    this.setData({
      currentTeamName: temp
    })
    store.addData(this, "dataFromTeamInfo")

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
    db.collection("team").where({
      name: this.data.currentTeamName,
    }).get().then(res => {
      return res.data[0]
     
    }).then(t => {
      that.setData({
        teamInfo:t
      }
      )
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
  editTeamInfo(){
    wx.navigateTo({
      url: "../team_edit/team_edit",
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  directTo(event) {

    let index = event.detail
    switch (index) {
      case 0: {
        wx.navigateTo({
          url: '../team_advise/team_advise',
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
        break
      case 1: {
        wx.navigateTo({
          url: '../team_info/team_info',
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
    }
  },
})