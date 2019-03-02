// pages/myOrders/orders.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    works: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataList_works();
  },

  getDataList_works: function () {
    console.log('getDataList ' + api.BarberOrderList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.BarberOrderList,
      {
        'size': 10,
        'barberid': app.globalData.userid,
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList8888888888888888888888888888888888 ');
        console.log(res);
        // success
        that.setData({ works: res.data.data.list });
        // console.log(that.data);
        that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getDataList err' + err);
        // fail
        that.stopRefreshing();
        wx.showToast({
          title: '正在获取数据…',
          icon: 'loading',
          duration: 3000,
          mask: true
        });
        that.setData({ works: (wx.getStorageSync('works') || []) });
      });
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
})