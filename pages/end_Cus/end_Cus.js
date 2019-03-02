// pages/end_Cus/end_Cus.js
var app = getApp();
var util = require('../../utils/util.js');
var wxpay = require('../../utils/wxpay.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    detail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var scene = decodeURIComponent(options.scene)
    var scene=options.orderid
    this.setData({
      id: scene
    })
    this.getData_Order();
  },

  getData_Order: function () {
    console.log('getDataList ' + api.OrderDetail);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.OrderDetail,
      {
        'orderid': that.data.id
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ************************88888888888888');
        console.log(res);
        // success
        that.setData({ detail: res.data });
        that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getDataList err' + err);
        // fail
        that.stopRefreshing();
        that.setData({ detail: (wx.getStorageSync('detail') || []) });
      });
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  confirmPay: function () {
    var that=this;
    wxpay.startPay(that.data.detail.payed_price*100,util.getCurrentSecond()).
    then(res1 => {
      console.log(res1);
      createQuizSuccess(that.data.id,that.data.detail.payed_price);
    }).catch((err1 => {
      console.log(err1);
      util.showDialog('支付失败！');
    }))
  }
})