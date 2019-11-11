// pages/join_create/join_create.js
import Toast from 'vant-weapp/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamType:['1','2','3','4'],
    teamName:"",
    teamDetail:"",
    leader:"",
    newTeam:{}

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
  createTeam(){
    
    const newName = this.data.teamName
    const newLeader = this.data.leader
    const newTeam ={
      newName,
      newLeader
    }
    console.log(newTeam)
    const db = wx.cloud.database()
    db.collection('team').add({
      // data 字段表示需新增的 JSON 数据
      data: {
      name:newName,
      leader:newLeader
      }
    })
    .then(res => {
      console.log(res)
    })
  },





  change1(e){
  this.setData({
    teamName:e.detail
  })

  },



  change2(e){
    this.setData({
      leader:e.detail
    })
  
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  }
})