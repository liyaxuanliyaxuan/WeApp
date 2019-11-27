// pages/join_create/join_create.js
import Toast from 'vant-weapp/toast';
var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    openid: "",
    date: "",
    teamid:"",
    memberid: '',
    teamType: "",
    teamName: "",
    teamDetail: "",
    leader: "",
    newTeam: {},
    teamLogo: "",
    fileID: '',
    cloudPath: '',
    imagePath: '',
    pic:''
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
          return  res.fileID
        }).then(id=>{
          console.log('id',id)
          that.setData({
            id:id
          })
          wx.cloud.downloadFile({
            fileID: id
          }).then(res => {
            // get temp file path
            console.log(res.tempFilePath)
            console.log('fileID',id)
            return res.tempFilePath
            }).then(pic => {
              that.setData({
                pic: pic
              })
            })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    //获取当前日期
    let DATE = util.formatDate(new Date());
    this.setData({
      date: DATE
    })
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
        console.log("openid",that.data.openid)
        const db = wx.cloud.database()
        //获取个人id
        db.collection("member").where({
          _openid: that.data.openid,
        }).get().then(res => {
          that.setData({
            memberid: res.data[0]._id,
            leader:res.data[0].realName
          })
          console.log('member',res.data[0])
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
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
  createTeam() {
    const that = this
    const newName = this.data.teamName
    const newLeader = this.data.leader
    const newType = this.data.teamType
    const newDetail = this.data.teamDetail
    const newLogo = this.data.teamLogo
    const newTeam = {
      newName,
      newLeader,
      newType,
      newDetail,
      newLogo,
    }
    if (newName == '') {
      wx: wx.showToast({
        title: '请输入团队名称',
        icon: 'none',
      })
      return false
    }
    else if (newType == '') {
      wx: wx.showToast({
        title: '请输入团队性质',
        icon: 'none',
      })
      return false
    }
    

    wx.showModal({
      content: '创建成功',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          console.log(newTeam)
          const db = wx.cloud.database()
          db.collection('team').add({
            // data 字段表示需新增的 JSON 数据
            data: {
              name: that.data.teamName,
              leader: that.data.leader,
              type: that.data.teamType,
              detail: that.data.teamDetail,
              pic:that.data.id,
              date:that.data.date             
            },success:res =>{
              console.log('success')
              //查找团队Id
              console.log('查找团队Id', that.data.teamName)
              db.collection("team").where({
                name: that.data.teamName,
              }).get().then(res => {
                console.log("get teamid successful")
                console.log(res.data)
                console.log(res.data[0]._id)
                return res.data[0]._id
              }).then(teamid => {
                /**
                that.setData({
                  teamid: teamid
                })
                */
                //将团队信息写入个人
                console.log('memberid', that.data.memberid)
                console.log('teamid', teamid)
                wx.cloud.callFunction({
                  name: "add_memberteam",
                  data: {
                    name: that.data.teamName,
                    teamid: teamid,
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
                    openid: that.data.openid,
                    name:that.data.leader,
                    id: teamid,
                  },
                  success: function (res) {
                    console.log('success')
                  },
                  fail: console.log('fail')
                })
                wx.switchTab({
                  url: '/pages/join/join'
                })
              })
            },
            fail:console.log('fail')
          })
        }
        else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  },
  change1(e) {
    this.setData({
      teamName: e.detail
    })
  },
  /**
  change2(e) {
    this.setData({
      leader: e.detail
    })
  },
  */
  change3(e) {
    this.setData({
      teamType: e.detail
    })
  },
  change4(e) {
    this.setData({
      teamDetail: e.detail
    })
  },
  change5(e) {
    this.setData({
      teamLogo: e.detail
    })
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  }
})