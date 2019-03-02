// pages/myCoupon/coupon.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    discountList: [],
    icon_path: '../../icon/icon_paid.png'
  },
   returnBtn:function(){
     wx.navigateBack({
       delta: 1 })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDiscountList();
  },

  getDiscountList: function () {
    console.log('getDiscountList ' + api.CustomerDiscountList);
    //wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.CustomerDiscountList,
      {
        'size': 10,
        'customerid': app.globalData.userid
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDiscountList ');
        console.log(res);
        // success
        that.setData({ discountList: res.data.data.list });
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
      });
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  }
})