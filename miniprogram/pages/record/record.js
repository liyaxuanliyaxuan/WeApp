// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    likedList:[],
    imageURL:"https://img3.doubanio.com/view/photo/albumcover/public/p1563537010.jpg",
    liked:0,
    show:false,
    myTeams:[],
    currentTeamName:"",
    defaultTeamName:"",
    unchoose:true,
    defaultTeam:"默认",
    currentMembers:[],
    likeNum:1,
    userMomentsTest:[{name:"hhhhh",moment:"kkkkkkk",stars:22},{name:"uuuu",moment:"ooooooo",stars:19}],
    userMoments:[]
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
    //console.log(this.data.likedList)
    //const that = this
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
        currentTeamName:l[0],//默认团队为该成员的index0团队
        
      })
      return l[0]
    }).then(name=>{
      
        db.collection("team").where({
          name: name,
        }).get().then(res => {
          return res.data[0].member
        }).then(t => {
          return t.map(a => a.id)
        }).then(l => {
          that.setData({
            currentMembers: l
          })
          return l[0]
        }).then(id=>{
          //for(let i=0;i<idList.length;i++){
            wx.cloud.callFunction({
              name: "get_dongtai",
              data: {
                //id: idList[i]
                id:id
              },
              success: function (res) {
                //console.log(res.result.data.update)
                that.setData({
                  userMoments: res.result.data.update,
                })
              },
              fail: console.error
            })
    
         // }
        })

      }
    )






    const len = 40
    this.setData({
      likedList: Array.from({ length: len }, () => '#C9C9C9')
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
  addToLike(e){

    console.log(e.target.dataset.stars)
    if (e.target.dataset.flag ==="#C9C9C9") {
      e.target.dataset.stars++
      let param = {}
      let string = "likedList[" + e.target.dataset.index + "]"
      param[string] = "red"
      this.setData(param)
      let param_2 = {}
      let string_2 = "userMoments["+e.target.dataset.index+"].stars"
      param_2[string_2] = e.target.dataset.stars++
      this.setData(param_2)

    }
    else {
      e.target.dataset.stars--
      let param_ = {}
      let string_ = "likedList[" + e.target.dataset.index + "]"
      param_[string_] = "#C9C9C9"
      this.setData(param_)
      let param_3 = {}
      let string_3 = "userMoments[" + e.target.dataset.index + "].stars"
      param_3[string_3] = e.target.dataset.stars--
      this.setData(param_3)

    }

  }
  ,
  enterTeam(e){
    const that = this
    const db = wx.cloud.database()
    this.setData({
      currentTeamName: e.target.dataset.team,
      
    })
    db.collection("team").where({
      name: this.data.currentTeamName,
    }).get().then(res => {
      return res.data[0].member
    }).then(t => {
      return t.map(a => a.id)
    }).then(l => {
      that.setData({
        currentMembers: l
      })

    return l[0]//暂时的报错是由于数据库的格式问题
    }
    ).then(id=>{
      wx.cloud.callFunction({
        name: "get_dongtai",
        data: {
          id: id
        },
        success: function (res) {
          console.log(res.result.data.update)
        },
        fail: console.error
      })
     
    })
  }
})