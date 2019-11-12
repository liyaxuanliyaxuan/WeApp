// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    myTeams:[],
    currentTeamName:"null",
    defaultTeamName:"",
    unchoose:true,
    defaultTeam:"默认",
    currentMembers:[],
    likeNum:1,
    userMoments:[{name:"hhhhh",moment:"kkkkkkk"},{name:"uuuu",moment:"ooooooo"}]

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
      name:"陈诚",
    }).get().then(res => {

      // res.data 包含该记录的数据
      console.log(res.data[0].teams)
      return res.data[0].teams
    }).then(t=>{
      //console.log(t.map(a => a.id))  
      return t.map(a => a.name)
    }).then(l => {
      that.setData({
        myTeams: l,
        defaultTeamName:l[1],
        
      })
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
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  addRecord(){
    wx.navigateTo({
      url: '../record_write/record_write',
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
  enterTeam(e){
    const that = this
    const db = wx.cloud.database()
    this.setData({
      currentTeamName: e.target.dataset.team,
      unchoose:false
    })
    db.collection("team").where({
      name: this.data.currentTeamName,
    }).get().then(res => {
      return res.data[0].member
    }).then(t => {
      return t.map(a => a.name)
    }).then(l => {
      that.setData({
        currentMembers: l
      })

    })
  }
})