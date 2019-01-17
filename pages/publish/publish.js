// pages/publish/publish.js
var utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wid:'',
    cont: '',
    imgnum: 2,
    imgpath: [],
    checked: false
  },
  cancelTap: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  publishTap: function (e) {
    var that = this;
    utils.isLogin('publish', function (result) {
      if(result){
        that.setData({ wid: result })
        var cont = that.data.cont;
        if (cont == '') {
          wx.showToast({
            title: "请输入内容",
            image: "/images/alert.png"
          })
          return false;
        }
        wx.request({
          url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/publish',
          data: {
            wid: that.data.wid,
            content: cont,
            imgpath: that.data.imgpath,
            checked: that.data.checked
          },
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 1) {
              wx.reLaunch({
                url: '../index/index'
              })
            } else {
              wx.showToast({
                title: "发布失败",
                image: "/images/alert.png"
              })
            }
          }
        })
      }
    }) 
  },
  textChanged: function (e) {
    this.setData({ cont: e.detail.value });
  },
  switchChanged: function (e) {
    this.setData({ checked: e.detail.value });
  },
  addImages: function () {
    var that = this;
    var imglength = that.data.imgpath.length;
    var imgnum = that.data.imgnum;
    var num = imgnum - imglength;
    if (imglength < imgnum) {
      wx.chooseImage({
        count: num,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var tempFilePaths = res.tempFilePaths
          for (var i = 0; i < tempFilePaths.length; i++) {
            wx.uploadFile({
              url: 'https://www.vapee.com/new_vapee/index.php/web/reply/upload_images?litimg=false',
              filePath: tempFilePaths[i],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success(res) {
                var imgpath = that.data.imgpath;
                var jsonStr = res.data;
                jsonStr = jsonStr.replace(" ", "");
                if (typeof jsonStr != 'object') {
                  jsonStr = jsonStr.replace(/\ufeff/g, "");
                  res.data = JSON.parse(jsonStr);
                }
                that.setData({
                  imgpath: imgpath.concat(res.data.msg)
                });
              }
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: "至多上传3张",
        image: "/images/alert.png"
      })
    }
  },
  delImg: function (e) {
    var imgpath = this.data.imgpath;
    var src = e.target.dataset.src;
    for (var i = 0; i < imgpath.length; i++) {
      if (imgpath[i] == src) {
        imgpath.splice(i, 1);
      }
    }
    this.setData({
      imgpath: imgpath,
    });
  },
  seeImg: function (e) {
    var imgpath = this.data.imgpath;
    var src = e.target.dataset.src;
    wx.previewImage({
      current: src,
      urls: imgpath
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.isLogin('publish', function (result) {
      if (result) {
        that.setData({ wid: result })
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

  }
})