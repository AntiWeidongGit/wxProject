// pages/QR_code/code.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    img: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      id: options.id
    })
    that.getQrCode_A(options.access_token);
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  getQrCode_A: function (access_token) {
    var that=this;
    wx.request({
      url: "https://api.weixin.qq.com/wxa/getwxacode?access_token=" + access_token,
      method: 'POST',
      responseType: 'arraybuffer',
      data: {
        path: 'pages/end_Cus/end_Cus', 
        scene: that.data.id,
        width: 430,
        auto_color: false,// 自动配置线条颜色，如果颜色依然是黑色，则说明不建议配置主色调
        line_color: { "r": "0", "g": "0", "b": "0" } // auto_color 为 false 时生效，使用 rgb 设置颜色 
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          img: wx.arrayBufferToBase64(res.data)
        })
      }
    })
  },

  goToPay:function(){
    wx.navigateTo({
      url: '../end_Cus/end_Cus?orderid='+this.data.id,
    })
  }
})