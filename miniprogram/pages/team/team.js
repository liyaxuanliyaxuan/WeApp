// pages/team/team.js
import store from "../../utils/store.js"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    teams:[],
    teamNames:[],
    teamHistory:[],
    round:true,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgUrls: [
      "cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image2674.3974602027088.png", "cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image1253.2703794961785.png", "cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image7893.673448224204.jpg", "cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image2646.524894211055.png",  "cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image2793.232629361855.jpg",
"cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image8345.86425860766.jpeg"
],
    show:false,
    myTeams:[],
    currentTeamName:"My Team",
    defaultTeamName:"",
    unchoose:true,
    defaultTeam:"默认",
    currentMembers:[],
    history:[],
    active:'0'
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
    //页面数据加入数据池
    store.addData(this, "dataFromTeam")
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
    const that = this
    const db = wx.cloud.database()
    //获得个人openId
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        that.setData({
          openid: app.globalData.openid
        })
        console.log("openid", that.data.openid)
        //获取个人id
        db.collection("member").where({
          _openid: that.data.openid,
        }).get().then(res => {
          console.log(res.data[0].teams)
          return res.data[0].teams
        }).then(teams => {
          that.setData({
            teams: teams
          })
          console.log('myTeams', that.data.teams)
          return teams.map(a => a.name)
        }).then(l => {
          that.setData({
            teamNames: l,
            defaultTeamName: l[0],
            //currentTeamName: l[0]
          })
          //console.log(that.data.currentTeamName)
          console.log('teamNames', that.data.teamNames)
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
    console.log('currentName', this.data.currentTeamName)
    db.collection("team").where({
      name: this.data.currentTeamName,
    }).get().then(res => {
      console.log('res',res)
      console.log('history', res.data[0].history)
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
this.setData({
  active:0
})
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
  addEvent() {
    wx.navigateTo({
      url: '../teamShow/teamShow',
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
  directTo(event){
    let index=event.detail.index
    console.log(event.detail)
    switch(index){
      case 0: {
        wx.switchTab({
          url: '../team/team',
        })
      }
      break;
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
      break;
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