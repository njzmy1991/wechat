// pages/user/user.js
var utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wid:"",
    list: {},
    page: "2",
    Datalen: 2,
    name: "",
    userimg: "",
    login:false,
    currentData: "publish",
  },
  /**
   * 点击登录
   */
  userLogin:function(e){
    wx.redirectTo({
      url: '../login/login?t=user'
    })
  },
  /**
   *获取帖子
   */
  getList: function (e) {
    var that = this;
    var wid = that.data.wid;
    wx.request({
      url: 'http://vapee.com/new_vapee/index.php/wechat/wxsmall/lists/'+e+'/'+wid,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res){
        that.setData({
          list: res.data.result
        });
      }
    }),
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },
  /**
   * 登录信息
   */
  userInfo: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              that.setData({
                login: true,
                name: res.userInfo.nickName,
                userimg: res.userInfo.avatarUrl
              })
            }
          })
        }
      }
    })
  },
  /**
   * 切换分类
   */
  checkCurrent: function (e) {
    var that = this;
    if (that.data.currentData === e.currentTarget.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.currentTarget.dataset.current
      });
      if(that.data.wid){
        this.getList(e.currentTarget.dataset.current);
      }
    }
  },
  likeScang: function (res) {
    var that = this;
    utils.isLogin('index', function (result) {
      if (result) {
        that.setData({ wid: result });
        utils.clickFavour({
          'tid': res.currentTarget.dataset.tid,
          'wid': that.data.wid,
          'favour': Number(res.currentTarget.dataset.favour)
        }, function (result) {
          var list = that.data.list;
          var key = res.currentTarget.dataset.key;
          list[key]['favour'] = result;
          that.setData({ list });
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    utils.isLogin('user', function (result) {
      if (result) {
        that.setData({wid:result});
        that.userInfo();
        that.getList('publish');  
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      var tid = res.target.dataset.tid;
      var list = that.data.list;
      utils.shareHttps({
        'tid': tid,
        'wid': that.data.wid,
        'forward': res.target.dataset.forward
      }, function (result) {
        list[res.target.dataset.key]['forward'] = result;
        that.setData({ list });
      })
      return {
        title: res.target.dataset.content,
        path: 'pages/details/details?tid=' + tid,
        imageUrl: res.target.dataset.img
      }
    } else {
      return false;
    }
  }
})