// pages/subscribe_Success/sub_Success.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservation:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReservation();
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  },


 getReservation: function() {
    console.log('getDataList ' + api.CustomerSubscribeList);
    wx.showNavigationBarLoading();
    var that=this;
    util.weshowRequest(
      api.CustomerSubscribeList,
      {
        'customerid': app.globalData.userid,
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getReservation ' + app.globalData.userid);
        console.log('getDataList 33333333333333333333333333333333');
        console.log(res);
        // success
        that.setData({ reservation: res.data.data.list });
        // console.log(that.data);
        that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getDataList err 44444444444444444444444444444444' + err);
        // fail
        //that.stopRefreshing();
        wx.showToast({
          title: '正在获取数据…',
          icon: 'loading',
          duration: 3000,
          mask: true
        });
        that.setData({ reservation: (wx.getStorageSync('reservation') || []) });
      });
  },
  
  goToSelf:function(){
    wx.switchTab({
      url: '../PersonalHome/PersonalHome',
    })
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  }
})