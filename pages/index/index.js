var utils = require('../../utils/util.js')
Page({
  data: {
    wid:"",
    page: "2",
    list: {}
  },

  /**
   * 滚动加载
  */
  lower() {
    var that = this;
    var list = that.data.list;
    var page = that.data.page;
    var wid = wx.getStorageSync('wid');
    wx.request({
      url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/lists/index/'+wid,
      data: {
        page: page
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '我也是有底线的',
            icon: 'success',
            duration: 1000
          });
          return false;
        } else {
          page++;
          wx.showLoading({
            title: '加载中',
            icon: 'loading',
          });
          setTimeout(() => {
            that.setData({
              list: list.concat(res.data.result),
              page: page
            });
            wx.hideLoading();
          }, 1000)
        }
      }
    });
  },

  /**
   * 点赞
  */
  likeScang: function (res) {
    var that = this;
    utils.isLogin('index',function(result){
      if(result){
        that.setData({wid:result});
        utils.clickFavour({
          'tid': res.currentTarget.dataset.tid,
          'wid': that.data.wid,
          'favour': Number(res.currentTarget.dataset.favour)
        }, function (result){
          var list = that.data.list;
          var key = res.currentTarget.dataset.key;
          var is_favour = list[key]['is_favour'];
          if(is_favour){
            list[key]['is_favour'] = false;  
          }else{
            list[key]['is_favour'] = true;
          }
          list[key]['favour'] = result;
          that.setData({list});
        });
      }
    })
  },

  // 页面加载完毕的时候调用
  onLoad: function () {

  },
  // 页面显示的时候调用
  onShow: function () {
    var that = this;
    var wid = wx.getStorageSync('wid');
    wx.request({
      url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/lists/index/'+ wid,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          page:2,
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

  // 页面渲染完毕的时候调用
  onReady: function () {
  },

  // 页面隐藏的时候调用
  onHide: function () {
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
        that.setData({list});
      })
      return {
        title: res.target.dataset.content,
        path: 'pages/details/details?tid='+tid,
        imageUrl: res.target.dataset.img
      }
    }else{
      return false;
    }
  }
});