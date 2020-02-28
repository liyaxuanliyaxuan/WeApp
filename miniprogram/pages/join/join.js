// pages/join/join.js
import store from "../../utils/store.js"
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamid: '',
    popstate: 'true',
    memberid: '',
    inputValue: '',
    openid: "",
    realName:"",
    teamList: [],
    selected: "",
    chosenName: "",
    chosenId: "",
    currentTeamName: "My Team",
    show: false,
    content: ['加入', '查看详情'],
    actions: [
      {
        name: '加入'
      },
      {
        name: '查看详情'
      },
    ]
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
    //页面数据加入数据池
    store.addData(this, "dataFromTeam")
    const db = wx.cloud.database()
    db.collection('team').get().then(res => {
      // res.data 包含该记录的数据
      console.log(res.data)
      return res.data

    }).then( list=>{
      that.setData({
        teamList:list
      })
    }  
    )
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
this.setData({
  show:false
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
  onChange: function (event) {
    this.setData({
      inputValue: event.detail
    })
  },

  onCancel() {

  },

  //转入添加团队的界面
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

  //出现上拉菜单
  showPopup(e) {
    console.log(e)
    this.setData({
      show: true,
      chosenId: e.target.dataset.id,
      chosenName: e.target.dataset.teamname

    });
  },


  //搜索团队是否存在
  onSearch(e) {
    const that = this
    console.log(e.detail)
    let searchName = e.detail
    const db = wx.cloud.database()
    db.collection('team').where({
      name: searchName,
    })
      .get({
        success: res => {
          console.log('调用成功')
          console.log(res.data)
          if (res.data.length == 0) {
            console.log('该团队不存在，需要创建')
            wx.showToast({
              title: '该团队不存在',
              icon: "none",
              duration: 2000
            })
          }
          else {
            wx.showModal({
              content: '是否加入该团队',
              success(res) {
                if (res.confirm) {
                  console.log('确定')
                  console.log('确定加入')
                  //获得个人openId
                  wx.cloud.callFunction({
                    name: 'login',
                    data: {},
                    success: res => {
                      console.log('[云函数] [login] user openid: ', res.result.openid)
                      app.globalData.openid = res.result.openid
                      that.setData({
                        show:false,
                        openid: app.globalData.openid
                      })
                      console.log(app.globalData.openid)
                      console.log(that.data.openid)
                      //获得团队id
                      const db = wx.cloud.database()
                      console.log('searchName:', searchName)
                      db.collection("team").where({
                        name: searchName,
                      }).get().then(res => {
                          console.log(res.data)
                          console.log(res.data[0]._id)
                          let temp = res.data[0]._id
                          that.setData({
                            teamid: temp
                          })
                          console.log("add:" + that.data.teamid + searchName)
                      })
                      //获取个人id
                      db.collection("member").where({
                        _openid: that.data.openid,
                      }).get().then(res => {
                        return res.data[0]
                      }).then(t => {
                        that.setData({
                          memberid:t._id,
                          realName:t.realName
                        })
                        //将团队信息写入个人
                        console.log('memberid', that.data.memberid)
                        console.log('teamname', searchName)
                        console.log('teamid', that.data.teamid)
                        wx.cloud.callFunction({
                          name: "add_memberteam",
                          data: {
                            name: searchName,
                            teamid: that.data.teamid,
                            id: that.data.memberid,
                          },
                          success: function (res) {
                            console.log('success')
                          },
                          fail: console.log('fail')
                        })
                        //将个人信息写入团队
                        wx.cloud.callFunction({
                          name: "add_teammember",
                          data: {
                            id: that.data.memberid,
                            id: that.data.teamid,
                            realName:that.data.realName
                          },
                          success: function (res) {
                            console.log('success')
                          },
                          fail: console.log('fail')
                        })
                      })
                    },
                    fail: err => {
                      console.error('[云函数] [login] 调用失败', err)
                    }
                  })
                  wx.switchTab({
                    url: '/pages/join/join'
                  })
                }
                else if (res.cancel) {
                  console.log('取消')
                }
              }
            })
          }
          //console.log(res.data.length)
        }
      })
  },

  //选择团队
  chooseTeam(e) {
    console.log(e)
    console.log(e.target.dataset.name)
    this.setData({
      selected: e.target.dataset.name
    })
  },

  //加入团队
  enterTeam(event) {
    const that = this
    let teamid = that.data.chosenId;
    let teamname = that.data.chosenName;
    console.log("add:" + teamid + teamname)
    this.setData({
      currentTeamName: teamname
    })
    //页面数据加入数据池
    store.addData(this, "dataFromTeam")
    wx.navigateTo({
      url: '../team_detail/team_detail',
    })
  },

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
  },

  getClose() {
    this.setData({ show: false });
  },

  //是否加入推荐的团队
  Addteam(event) {
    const that = this
    //判断是否加入
    wx.showModal({
      content: '是否加入该团队',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          console.log('确定加入')
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
              console.log(app.globalData.openid)
              console.log(that.data.openid)
              //获得团队id
              let teamid = that.data.chosenId;
              let teamname = that.data.chosenName;
              console.log("add:" + teamid + teamname)
              //获取个人id
              const db = wx.cloud.database()
              db.collection("member").where({
                _openid: that.data.openid,
              }).get().then(res => {
                return res.data[0]
              }).then(t => {
                that.setData({
                  memberid:t._id,
                  realName:t.realName
                })
                //将团队信息写入个人
                console.log('memberid', that.data.memberid)
                console.log('teamname', teamname)
                console.log('teamid', teamid)
                wx.cloud.callFunction({
                  name: "add_memberteam",
                  data: {
                    name: teamname,
                    teamid: teamid,
                    id: that.data.memberid,
                  },
                  success: function (res) {
                    console.log('success')
                  },
                  fail: console.log('fail')
                })
                console.log('realName',that.data.realName)
                //将个人信息写入团队
                wx.cloud.callFunction({
                  name: "add_teammember",
                  data: {
                    openid: that.data.memberid,
                    id: teamid,
                    realName:that.data.realName
                  },
                  success: function (res) {
                    console.log('success')
                  },
                  fail: console.log('fail')
                })
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
          wx.switchTab({
            url: '/pages/join/join'
          })
        }
        else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },
})