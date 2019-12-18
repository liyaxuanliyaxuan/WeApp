// pages/team_add_advise/team_add_advise.js
import store from "../../utils/store.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTeamName:"",
    message:"",
    id:"",
    keyWords:''
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
    const that = this
    if (that.data.message == '') {
      wx: wx.showToast({
        title: '请输入您的想法',
        icon: 'none',
      })
      return false
    }
    else if (that.data.keyWords == '') {
      wx: wx.showToast({
        title: '请输入关键字',
        icon: 'none',
      })
      return false
    }
    //在此处无法使用update，只能通过调用云函数的方式，在云函数端对数据进行更新处理
    wx.showModal({
      content: '是否发布您的想法',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          const db = wx.cloud.database()
          db.collection("team").where({
            name:that.data.currentTeamName
          }).get().then(res=>{
            return res.data[0]._id
            console.log(res.data[0]._id)
          }).then(id=>{
          wx.cloud.callFunction({
            name:"add_advice",
            data:{
              name:"up",
              advice:that.data.message,
              key:that.data.keyWords,
              id:id,
            },
            success:function(res){
            },
            fail:console.error
          })
        })
        wx.navigateTo({
          url: '../team_advise/team_advise',
          success: console.log('success'),
          fail: console.log('fail'),
          complete: function () {
              // complete
          }
        })
      } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },
  onChange(e){
    this.setData({
      message:e.detail
    })
  },
  changeKey(e){
    this.setData({
      keyWords:e.detail
    })
  }
})