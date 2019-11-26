// pages/join_create/join_create.js
import Toast from 'vant-weapp/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
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
        title: '请输入团队名',
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
    else if (newLeader == '') {
      wx: wx.showToast({
        title: '请输入创建人姓名',
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
              pic:that.data.id             
            }
          }).then(res => {
              console.log(res)
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
  change1(e) {
    this.setData({
      teamName: e.detail
    })
  },
  change2(e) {
    this.setData({
      leader: e.detail
    })
  },
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