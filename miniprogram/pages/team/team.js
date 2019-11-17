// pages/team/team.js
import store from "../../utils/store.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    round:true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: ["pictures/food-1.jpg", "pictures/food-5.jpg", "pictures/food-6.jpg", "pictures/food-7.jpg"],
    
    show:false,
    myTeams:[],
    currentTeamName:"薪火小队",//此处还没有动态实现默认的团队名称
    defaultTeamName:"",
    unchoose:true,
    defaultTeam:"默认",
    currentMembers:[],
    history:[],
    danmuList:[
      "我们是最棒的",
      "新的一年，再度起航",
      "今天你写代码了吗？"
    ]
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    store.addData(this,"dataFromTeam")
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: 'cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image.jpg',
        maxAge: 60 * 60, // one hour
      }]
    }).then(res => {
      // get temp file URL
      console.log(res.fileList)
    }).catch(error => {
      // handle error
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
        defaultTeamName:l[0],
        
      })
    })
    db.collection("team").where({
      name: this.data.currentTeamName,
    }).get().then(res => {
      return res.data[0].history
    }).then(t => {
      that.setData({
        history: t
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
  directTo(event){
     
    let index=event.detail.index
    console.log(event.detail)
   switch(index){
     case 0: {
       wx.switchTab({
         url: '../team/team',
       })
     }
       case 1:{
         wx.navigateTo({
           url: '../team_advise/team_advise',
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
       }
       break
       case 2:{
         wx.navigateTo({
           url: '../team_info/team_info',
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
       }
   }
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
      return res.data[0].history
    }).then(t => {
      that.setData({
        history:t
      })
    })
  }


})