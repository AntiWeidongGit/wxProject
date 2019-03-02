// pages/myReservation/personal.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {image:"", username: "慵懒的猫", time: 30, credits:230},
    headPhoto: {face: "70", age: 25, sex: '男', color: "yellow", type: "方形", glass: "have"},
      reservation: null,
      attribute: null,
      myHairSrc:null,
    statusBarHeight: app.globalData.statusBarHeight
  },
  jumpToBarber:function(){
    wx.navigateTo({
      url: '../myReservation/jumpToBarber',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
      this.getPersonalData();
  },
   getPersonalData:function(){
    util.weshowRequest(
      api.StoreList,
      {
        
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getShopList ');
        console.log(res);
        // success
        that.setData({ info: res.data.data.list });
        // console.log(that.data);
        that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getShopList err' + err);
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
  onShow:function(){
   
       var that=this;
    // var photo = wx.getStorageInfoSync("personnal")
       that.setData({
         myHairSrc: wx.getStorageSync("personnal")
       })
    wx.removeStorageSync("personnal");
  },

  getInfo:function(){
    console.log('getDataList ' + api.StoreCustomerDetail);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreCustomerDetail,
      {
        'customerid': app.globalData.userid
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList 11111111111111111111');
        console.log(res);
        // success
        that.setData({ info: res.data });
        console.log(res.data.type)
        app.globalData.userType=res.data.type
        // console.log(that.data);
        that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getDataList err22222222222222222222' + err);
        // fail
        that.stopRefreshing();
        wx.showToast({
          title: '正在获取数据…',
          icon: 'loading',
          duration: 3000,
          mask: true
        });
        that.setData({ info: (wx.getStorageSync('info') || []) });
      });
  },

  getReservation:function(){
    console.log('getDataList ' + api.BarberSubscribe);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.BarberSubscribe,
      {
        'barberid ': null,
        'customerid': app.globalData.userid,
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList 33333333333333333333333333333333');
        console.log(res);
        // success
        that.setData({ reservation: res.data });
        // console.log(that.data);
        //that.stopRefreshing();
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

  getAttribute:function(){
    console.log('getDataList ' + api.CustomerAttribute);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.CustomerAttribute,
      {
        'customerid': app.globalData.userid
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList 555555555555555555555555555');
        console.log(res);
        // success
        that.setData({ attribute: res.data });
        // console.log(that.data);
        //that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getDataList err' + err);
        // fail
        //that.stopRefreshing();
        wx.showToast({
          title: '正在获取数据…',
          icon: 'loading',
          duration: 3000,
          mask: true
        });
        that.setData({ attribute: (wx.getStorageSync('attribute') || []) });
      });
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  },

  goToMyBarber:function(){
    wx.navigateTo({
      url: '../myBarber/myBarber',
    })
  },

  goToCoupon:function(){
    wx.navigateTo({
      url: '../myCoupon/coupon',
    })
  },

  changeToBarber:function(){
    if(app.globalData.userType!=1){
      wx.navigateTo({
        url: '../FaceIdentity/Identity',
      })
    }else{
      wx.navigateTo({
        url: '../BarBer/personal',
      })
    }
  },

  goToConsumption:function(){
    wx.navigateTo({
      url: '../myHistoryCost/cost',
    })
  },
  goToMyShareShop: function () {
    wx.navigateTo({
      url: '../myHistoryCost/cost',
    })
  },
  uploadHairPhoto: function () {
    var that=this;
    wx.navigateTo({
      url: '../camaraIdentity/camaraIdentity?photoName=personnal',
    })
  },
  takePhoto:function(){
    var that=this;
    wx.chooseImage({
      count:9,
      sizeType:['original','compressed'],
      sourceType: ['camera'],
      success: function(res) {
        myHairSrc:res.tempFilePaths
      },
    })

    console.log(myHairSrc);
  }
})

