// pages/record_write/record_write.js

import store from "../../utils/store.js";
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID: '',
    curIcon: "eye-o",
    cloudPath: '',
    imagePath: '',
    message: '',
    title:"",
    photoId: '',
    chosen: ['unchoosen', 'unchoosen', 'unchoosen'],
    teamToChoose: [{
      id: 1,
      name: '薪火小队',
      pic: "https://qpic.y.qq.com/music_cover/JBDCVgqXWXaYUvcsElqcicRsk0aiad9r1BCtxAwcqyn1txfvSZYWcpgw/300?n=1"
    }, {
      id: 2,
      name: '数模小分队',
      pic: "https://qpic.y.qq.com/music_cover/8eiaDBJ27yYicpMibYZmmEdNAPZ9gMjMvGu8ibJtY4sQelVxZ3qyGYB9fw/300?n=1"
    }, {
      id: 3,
      name: 'acm战队',
      pic: "https://qpic.y.qq.com/music_cover/0yiaX8d9LSmnROyId1RsUU7cH7IiabvZeibYgrITnKibMI1mmrsYEGZmNA/300?n=1"
    }],
    current: [],
    userInfo:{},
    openid:"",
    data:""
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
    //获取当前日期
    let DATE = util.formatTime(new Date());
    this.setData({
      date: DATE,
      userInfo: app.globalData.userInfo,
      openid: app.globalData.openid
    })
    const {
      fileID,
      cloudPath,
      imagePath,
    } = app.globalData
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    store.addData(this, "dataFromWriteRecord")

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    store.addData(this, "dataFromWriteRecord")

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
    const that = this
    console.log('origin fileID',this.fileID)
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
          that.setData({
            fileID:res.fileID
          })
          return [filePath, res.fileID]
        }).then(res => {
          that.setData({
            imagePath: res[0],
            photoId: res[1]
          })
        }).catch(error => {
          // handle error
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  onChange(e) {
    console.log(e.detail)
    this.setData({
      message: e.detail
    })
  },
  Change1(e) {
    console.log(e.detail)
    this.setData({
      title: e.detail
    })
  },
  submitMine(e) {
    console.log('message',this.data.message)
    console.log('this.fileID',this.data.fileID)
    console.log("userInfo",this.data.userInfo)
    console.log("openid",this.data.openid)
    const that = this
    const db = wx.cloud.database()
    if (that.data.title == '') {
      wx: wx.showToast({
        title: '请输入标题',
        icon: 'none',
      })
      return false
    }
    if (that.data.message == '') {
      wx: wx.showToast({
        title: '请输入内容',
        icon: 'none',
      })
      return false
    }
    if (that.data.fileID == ''){
      console.log("没有fileID")
      that.setData({
        fileID: "cloud://cloud-demo-l5rvx.636c-cloud-demo-l5rvx-1300498757/my-image3424.496308442722.jpg"
      })
    }
    db.collection("member").where({
      _openid:that.data.openid
    }).get().then(res => {
      return res.data[0]._id
    }).then(id => {
      wx.cloud.callFunction({
        name: "add_dongtai",
        data: {
          name:that.data.userInfo.nickName,
          logo:that.data.userInfo.avatarUrl,
          pic:that.data.fileID,
          date:that.data.date,
          title:that.data.title,
          content: that.data.message,
          id: id,
        },
        success: console.log("success"),
        fail: console.error
      })
    }).then(
      store.addData(this, "dataFromWriteRecord")
    )
    wx.showModal({
      content: '是否保存发布?',
      success(res){
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/record/record',
          })
        }
        else if (res.cancel) {
          console.log('取消')
        }
      },
      fail:
        console.error
    })
  },
  chooseToSee(e) {
    console.log(e)
    let temp = [...this.data.chosen]
    if (temp[e.target.dataset.index] !== "chosen") {
      temp[e.target.dataset.index] = "chosen"
    }
    else {
      temp[e.target.dataset.index] = "unchosen"

    }

    this.setData({
      chosen: temp
    })
  }

})