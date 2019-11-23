// pages/record_write/record_write.js

import store from "../../utils/store.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileID: '',
    cloudPath: '',
    imagePath: '',
    message:'',
    photoId:'',
    fruit: [{
      id: 1,
      name: '薪火小队',
    }, {
      id: 2,
      name: '数模小分队'
    }, {
      id: 3,
      name: 'acm战队'
    }],
    current: [],

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
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
         }) .then(res=> {
            console.log('[上传文件] 成功：', res)
            wx.hideLoading()

          return  [filePath,res.fileID]

        }).then(res=>{
        that.setData({
          imagePath:res[0],
          photoId:res[1]

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
  onChange(e){
    console.log(e.detail)
    this.setData({
      message:e.detail
    })
  },
  submitMine(e){
    console.log(this.data.message)
    const that = this
    const db = wx.cloud.database()
    db.collection("member").where({
      name:"陈诚"
    }).get().then(res => {
      return res.data[0]._id
    }).then(id => {
      wx.cloud.callFunction({
        name: "add_dongtai",
        data: {
          
          content: that.data.message,
          id: id,
        },
        success: function (res) {

        },
        fail: console.error
      })
    }).then(
      store.addData(this, "dataFromWriteRecord")
    )

  }

})