function clickFavour(like,result){
  wx.request({
    url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/addnum/favour',
    data: {'tid':like.tid, 'wid':like.wid},
    method: 'GET',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res.data.code == 1) {
        result(like.favour + Number(res.data.num));
      }
    }
  })  
}
function shareHttps(share, result){
  wx.request({
    url: 'https://www.vapee.com/new_vapee/index.php/wechat/wxsmall/addnum/forward',
    data: {'tid': share.tid, 'wid': share.wid},
    method: 'GET',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res.data.code == 1) {
         result(++share.forward);
      }
    }
  })
}
function isLogin(t, result){
  var wid = wx.getStorageSync('wid');
  if (!wid) {
    wx.showModal({
      title: '提 示',
      content: '您还未登录 是否确定授权登录',
      success(res) {
        if (res.confirm) {
          if(t == 'user'){
            wx.redirectTo({url: '../login/login?t=user'})
          }else{
            wx.navigateTo({ url: '../login/login?t=' + t }) 
          }
        }else if(res.cancel) {}
      }
    })
  } else {
    result(wid); 
  }
}
module.exports = {
  clickFavour: clickFavour,
  shareHttps: shareHttps,
  isLogin:isLogin
}
