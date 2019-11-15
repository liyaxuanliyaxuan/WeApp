// pages/team_edit/team_edit.js
import store from "../../utils/store.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName:"",
    leader:"",
    currentTeamName:"",
    originInfo:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const temp = store.dataFromTeamInfo.teamInfo
    this.setData({
      originInfo: temp
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
  change1(e) {
    this.setData({
      teamName: e.detail
    })

  },



  change2(e) {
    this.setData({
      leader: e.detail
    })

  },
  submit(){
    console.log(this.data.leader)
  }
})