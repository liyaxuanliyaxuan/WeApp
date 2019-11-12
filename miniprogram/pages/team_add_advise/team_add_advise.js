// pages/team_add_advise/team_add_advise.js
import store from "../../utils/store.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTeamName:"",
    message:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const temp = store.dataFromTeam.currentTeamName
    this.setData({
      currentTeamName:temp
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
  upBtn(){
    //console.log("hey")
  //在此处无法使用update，只能通过调用云函数的方式，在云函数端对数据进行更新处理
    const db = wx.cloud.database()
    const _ = db.command
    const content = this.data.message
    /*
    db.collection('team').where({
      name:this.data.currentTeamName
    }).update(
     { data: {
        advice: _.push({content:content})
      },
      success: function (res) {
        console.log(res.data)
      }}
    )
    */
    

  },
  changeInput(e){
    
    this.setData({
      message:e.detail
    })
  }
})