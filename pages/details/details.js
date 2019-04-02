// pages/details/details.js
var utils = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tid: "",
    wid: "",
    page: "2",
    page_num: "4",
    p_rid: "0",
    reply: {},
    rcont: "",
    details: {},
    showMore:false,
    showModal: false,
    maskHidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tid = options.tid;
    var wid = wx.getStorageSync('wid');
    wx.request({
      url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/details',
      data: {tid: tid, wid:wid},
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        that.setData({
          tid: tid,
          reply: res.data.result.reply,
          details: res.data.result,
        });
      }
    });
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },

  /**
   * 评论加载
   */
  lower() {
    var that = this;
    var page = that.data.page;
    var tid = that.data.tid;
    var reply = that.data.reply;
    if (reply.length < that.data.page_num) {
      return false;
    }
    wx.request({
      url: 'http://vapee.com/new_vapee/index.php/wechat/wxsmall/greply/' + tid + '/' + page,
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.result.length > 0) {
          page++;
          wx.showLoading({
            title: '加载中',
            icon: 'loading',
            duration: 1000
          });
          setTimeout(() => {
            that.setData({
              page: page,
              reply: reply.concat(res.data.result)
            });
            wx.hideLoading();
          }, 1500)
        } else {
          wx.showToast({
            title: '我也是有底线的',
            icon: 'success',
            duration: 1000
          });
          that.setData({
            showMore: true
          });
          return false;
        }
      }
    });
  },

  /**
   * 点赞
   * 
  */
  likeScang: function (e) {
    var that = this;
    utils.isLogin('details&tid='+that.data.tid, function (result) {
      if(result){
        that.setData({wid:result});
        utils.clickFavour({
          'tid': that.data.tid,
          'wid': that.data.wid,
          'favour': Number(e.currentTarget.dataset.favour)
        }, function (result) {
          var details = that.data.details;
          var is_favour = that.data.details.is_favour;
          if (is_favour) {
            details['is_favour'] = false;
          } else {
            details['is_favour'] = true;
          }
          details['favour'] = result;
          that.setData({
            details: details
          })
        });
      }
    })
  },

  /**
   * 打开评论模态框
   */
  toShowModal(e) {
    var that = this;
    utils.isLogin('details&tid='+that.data.tid, function(result){
      if(result){
        that.setData({
          wid: result,
          showModal: true,
          p_rid: e.currentTarget.dataset.p_rid
        })
      }
    })
  },
  /**
   * 关闭评论模态框
   */
  hideModal() {
    this.setData({
      p_rid:"0",
      showModal: false
    });
  },

  /**
   * 评论框内容抓取
   */
  bindblur: function (e) {
    this.setData({rcont: e.detail.value});
  },

  /**
   * 评论提交
   */
  subReply: function (e) {
    var that = this;
    wx.request({
      url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/areply',
      method: 'POST',
      header: {
        'content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        tid: that.data.tid,
        wid: that.data.wid,
        p_rid: that.data.p_rid,
        rcont: that.data.rcont
      },
      success: function (res) {
        var reply = that.data.reply;
        that.setData({
          reply: res.data.result.reply.concat(reply)
        })
        that.hideModal();
      },
      fail: res => {
        wx.showToast({
          title: '网络不好哟',
          duration: 3000,
          duration: 1000
        })
      }
    })
  },

  /**
   * 图片点击事件
   */
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;
    var imgList = event.currentTarget.dataset.list;
    wx.previewImage({
      current: src,
      urls: imgList
    })
  },

  /**
   * 点击生成海报
  */
  formSubmit: function (e) {
    var that = this;
    wx.showToast({
      title: '努力生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },

  /**
   * 图片保存到相册授权
  */
  baocun: function(){
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.savePoster();
            }, fail(){
              wx.showModal({
                title: '警 告',
                content: '是否重新授权保存到相册',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        res.authSetting = {
                         "scope.writePhotosAlbum": true
                        }
                      }
                    })
                  }else if (res.cancel){}
                }
              }) 
            }
          })
        }else{
          that.savePoster();
        }
      }
    })
  },

  /**
   * 保存相册
  */
  savePoster: function (){
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              that.hideMask();
            }
          }
        })
      }
    })    
  },

  /**
   * 取消生成海报
  */
  hideMask() {
    this.setData({
      maskHidden: false
    });
  },

  /**
   * 创建海报生成
  */
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#ffe200")
    context.fillRect(0, 0, 375, 667)
    var path = "../../images/share.png";
    context.drawImage(path, 0, 0, 375, 183);
    context.setFontSize(24);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.stroke();
    context.setFontSize(14);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText("睡个毛起来嗨", 185, 370);
    context.stroke();
    context.arc(186, 246, 50, 0, 2 * Math.PI)
    context.strokeStyle = "#ffe200";
    context.clip();
    context.draw();
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {}
      });
    }, 200);
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
      var details = that.data.details;
      utils.shareHttps({
        'tid': that.data.tid,
        'wid': that.data.wid,
        'forward': details.forward
        }, function(result){
          details['forward'] = result;
          that.setData({
            details:details
          })
      })
      return {
        title: that.data.details.content,
        path: 'pages/details/details?tid=' + that.data.tid,
        imageUrl: res.target.dataset.img
      }
    }else{
      return false;
    }
  }
})