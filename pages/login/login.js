// pages/login/login.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nav_url:null
  },
  /**
   * 授权操作
   */
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.queryUsreInfo();    
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法个人操作，请授权之后再进行!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('返回授权')
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var nav_url = '../'+options.t+'/'+options.t
    if (options.tid != undefined){
      nav_url = nav_url + '&tid=' + options.tid
    }
    that.setData({
      nav_url: nav_url
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.queryUsreInfo();    
        }
      }
    })
  },
  
  /**
   * 获取用户信息
   */
  queryUsreInfo: function () {
    var that = this;
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          success: function (res_u) {
            wx.showToast({
              title: '授权中...',
              icon: 'loading',
              duration: 1000
            });
            wx.request({
              url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/login',
              data: {
                code: res.code,
                encryptedData: res_u.encryptedData,
                iv: res_u.iv
              },
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded' },
              success: function (res) {
                if (res.data.code == 1) {
                  wx.setStorageSync('wid', res.data.result.wid);
                } else {
                  wx.showToast({
                    title: res.data.result,
                    icon: 'loading',
                    duration: 1000
                  });
                }
                wx.switchTab({
                  url: that.data.nav_url
                }) 
              }
            })
          }
        })
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