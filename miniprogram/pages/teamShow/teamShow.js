// pages/record_write/record_write.js

import store from "../../utils/store.js"
var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTeamName: "",
    openid:"",
    realName:"",
    message: "",
    title: "",
    id: "",
    pic: "",
    date:"",
    fileID: '',
    cloudPath: '',
    imagePath: '',
    message: '',
    photoId: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    const temp = store.dataFromTeam.currentTeamName
    this.setData({
      currentTeamName: temp
    })
    let DATE = util.formatDate(new Date());
    this.setData({
      date:DATE
    })
    const db = wx.cloud.database()
    db.collection("team").where({
      name: that.data.currentTeamName
    }).get().then(res => {
      return res.data[0]._id
    }).then(id => {
      that.setData({
        id: id
      })
      console.log('id',that.data.id)
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
    const {
      fileID,
      cloudPath,
      imagePath,
    } = app.globalData

    this.setData({
      fileID,
      cloudPath,
      imagePath,
    })
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
          console.log('pic', pic)
          that.setData({
            pic: pic
          })
          wx.cloud.downloadFile({
            fileID: pic
          }).then(res => {
            // get temp file path
            console.log(res.tempFilePath)
            console.log('fileID', id)
            return res.tempFilePath
          }).then(pic => {
            console.log(pic)
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
  Change1(e) {
    console.log(e.detail)
    this.setData({
      title: e.detail
    })
  },
  onChange(e) {
    console.log(e.detail)
    this.setData({
      message: e.detail
    })
  },

  submitMine(e) {
    console.log(this.data.message)
    const that = this
    if (that.data.message == '') {
      wx: wx.showToast({
        title: '请输入事件内容',
        icon: 'none',
      })
      return false
    }
    else if (that.data.title == '') {
      wx: wx.showToast({
        title: '请输入标题',
        icon: 'none',
      })
      return false
    }
    console.log("newEventid:",
      that.data.id,
    )
    that.setData({
      openid: app.globalData.openid
    })
    console.log('openid:',that.data.openid)
    const db = wx.cloud.database()

    //根据openid获得其他信息
    db.collection('member').where({
      _openid: this.data.openid,
    })
      .get({
        success: res => {
          //console.log('调用成功')
          console.log(res.data)
          console.log(res.data[0].realName)
          if (res.data.length == 0) {
            console.log('调取失败')
          }
          else {
            console.log('调用成功')
            console.log('again', res.data[0].realName)
            let temp = res.data[0].realName
            that.setData({
              realName: temp
            })
            console.log(that.data.realName)
          }
        }
      })
    wx.showModal({
      content: '是否发布新的团队大事件',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          wx.cloud.callFunction({
              name: "add_event",
              data: {
                message: that.data.message,
                title: that.data.title,
                date:that.data.date,
                id: that.data.id,
                pic:that.data.pic,
                who:that.data.realName
              },
              success: console.log('success'),
              fail: console.log('fail')
          })
        wx.switchTab({
            url: '../team/team',
        })
      } else if (res.cancel) {
          console.log('取消')
        }
      }
    })
  }
})