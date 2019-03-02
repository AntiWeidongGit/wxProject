var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
var LoginMain = require('./LoginMain.js');
var CustomerHome = require('./CustomerHome.js');
var BarberHome = require('./BarberHome.js');
import myDialog from '../template/dialog';

var app = getApp();

var isPullDownRefreshing = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // LoginMain
    faceid: app.globalData.faceid,
    userType: 0,
    userInfo: app.globalData.userInfo,
    accountInfo: app.globalData.accountInfo,
    hasUserInfo: app.globalData.hasUserInfo,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    // CustomerHome
    info: null,
    reservation: null,
    attribute: null,
    mysubscribe: null,
    cur_service: null,

    //BarberHome
    reservations: [],
    orders: [],
    barberDetails: [],
    barberID: null,
    timeToReserve: []
  },

  onLoad: function (options) {
    console.log('onLoad...');
    console.log('onLoad... global');
    console.log(app.globalData.faceid);

    this.setData({
      userInfo: app.globalData.userInfo,
      faceid: app.globalData.faceid,
      userType: 2
    })

    var that = this;
    if (this.data.faceid == null) {
      util.login().then(res => {
        console.log('home login success');
        console.log(res);
        LoginMain.onLogin(that, res);
      }).catch((err) => {
        // fail
        console.log('home login fail');
        console.log(err);
        LoginMain.onLogin(that, null);
        that = null;
      });
    }

    //CustomerHome
    else if (this.data.userType == 2) {
      CustomerHome.getInfo(this);
      CustomerHome.getReservation(this);
      CustomerHome.getAttribute(this);
      CustomerHome.getCurService(this);
    }

    //BarberHome
    else {
      BarberHome.getDataList_details(this);
      BarberHome.getDataList_reservations(this);
      BarberHome.getDataList_orders(this);
      BarberHome.getDataList_time(this)
    }
  },

  onShareAppMessage: function (ops) {
    return model.getShareFunction();
  },

  onShow: function () {
    //this.getAccount(app.globalData.userid);
    console.log('onShow... data');

    if (app.globalData.faceid == null) {
    }
    else {
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady... data');
  },

  onGotUserInfo: function (e) {
    LoginMain.onGotUserInfo(this, e);
  },

  goToMyBarber: function () {
    CustomerHome.goToMyBarber();
  },

  goToCoupon: function () {
    CustomerHome.goToCoupon();
  },

  goToConsumption: function () {
    CustomerHome.goToConsumption();
  },

  goToMyOrders: function () {
    BarberHome.goToMyOrders();
  },

  goToMyCustomers: function () {
    BarberHome.goToMyCustomers();
  },

  gotoCashdraw: function () {
    BarberHome.gotoCashdraw();
  },

  changeToBarber: function () {
    CustomerHome.changeToBarber(this);
    BarberHome.getDataList_details(this);
    BarberHome.getDataList_reservations(this);
    BarberHome.getDataList_orders(this);
    BarberHome.getDataList_time(this);
  },

  backToprevPage: function () {
    BarberHome.backToprevPage();
  },

  changeToCustomer: function () {
    BarberHome.changeToCustomer(this);
    CustomerHome.getInfo(this);
    CustomerHome.getReservation(this);
    CustomerHome.getAttribute(this);
    CustomerHome.getCurService(this);
  },

  select0: function (event) {
    BarberHome.select0(this, event);
  },

  select1: function (event) {
    BarberHome.select1(this, event);
  },

  select2: function (event) {
    BarberHome.select2(this, event);
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  }
})
