// pages/team_edit/team_edit.js
import store from "../../utils/store.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName:"",
    teamid:"",
    leader:"",
    currentTeamName:"",
    originInfo:{},
    teamInfo:{},
    name:"",
    type:"",
    detail:"",
    pic:"",
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const temp = store.dataFromTeam.currentTeamName
    this.setData({
      currentTeamName: temp
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
    db.collection("team").where({
      name: this.data.currentTeamName,
    }).get().then(res => {
      return res.data[0]
    }).then(t => {
      that.setData({
        teamInfo: t,
        name:t.name,
        detail:t.detail,
        type:t.type,
        pic:t.pic,
        teamid:t._id
      })
    })
    console.log('teamInfo',that.data.teamInfo)
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
  // 上传图片
  doUpload: function () {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]

        // 上传图片
        const cloudPath = 'my-image' + Math.random() * 10000 + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
        }).then(res => {
          console.log('[上传文件] 成功：', res)
          wx.hideLoading()
          return res.fileID
        }).then(pic => {
          console.log('pic:', pic)
          that.setData({
            pic: pic
          })
          wx.cloud.downloadFile({
            fileID: pic
          }).then(res => {
            // get temp file path
            console.log(res.tempFilePath)
            return res.tempFilePath
          }).then(id => {
            console.log('id:', id)
            that.setData({
              id: id
            })
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  change1(e) {
    this.setData({
     name: e.detail
    })
    console.log('realName:', this.data.realName)
  },
  change2(e) {
    this.setData({
      type: e.detail
    })
    console.log('date', this.data.date)
  },
  change3(e) {
    this.setData({
      detail: e.detail
    })
    console.log('job:', this.data.job)
  },
  submit(){
    const that = this
    //上传数据
    if (this.data.name == '') {
      wx: wx.showToast({
        title: '请输入团队名称',
        icon: 'none',
      })
      return false
    }
    else if (this.data.type == '') {
      wx: wx.showToast({
        title: '请输入团队性质',
        icon: 'none',
      })
      return false
    }
    //修改
    const db = wx.cloud.database()
    console.log('teamName:', that.data.name)
    wx.cloud.callFunction({
      name: "team_edit",
      data: {
        id: that.data.teamid,
        name: that.data.name,
        type: that.data.type,
        detail: that.data.detail,
        pic: that.data.pic,
      },
      success: console.log('success'),
      fail: console.log('fail')
    })
    wx.showModal({
      content: '保存成功',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          wx.navigateTo({
            url: '/pages/team_info/team_info'
          })
        }
        else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  }
})