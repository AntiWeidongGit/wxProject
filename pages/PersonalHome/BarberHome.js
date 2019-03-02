// pages/BarBer/personal.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
import myDialog from '../template/dialog';


function getDataList_details(that) {
  console.log('getDataList ' + api.StoreBarberDetail);
  wx.showNavigationBarLoading();

  util.weshowRequest(
    api.StoreBarberDetail,
    {
      'size': 10,
      'barberid': app.globalData.userid
    },
    'POST').then(res => {
      //if (res.data) {}
      console.log('getDataList11111111111111111111111111 ');
      console.log(res.data);
      // success
      that.setData({ barberDetails: res.data });
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
      that.setData({ barberDetails: (wx.getStorageSync('barberDetails') || []) });
    });
}

function getDataList_reservations(that) {
  console.log('getDataList_reservations ' + api.BarberSubscribeList);
  wx.showNavigationBarLoading();

  util.weshowRequest(
    api.BarberSubscribeList,
    {
      'size': 10,
      'barberid': app.globalData.userid
    },
    'POST').then(res => {
      //if (res.data) {}
      console.log('getDataList 222222222222222222222222222222');
      console.log(res);
      // success
      that.setData({ reservations: res.data.data.list });
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
      that.setData({ reservations: (wx.getStorageSync('reservations') || []) });
    });
}

function getDataList_orders(that) {
  console.log('getDataList ' + api.BarberOrderList);
  wx.showNavigationBarLoading();

  util.weshowRequest(
    api.BarberOrderList,
    {
      'size': 10,
      'storeid': that.data.barberID
    },
    'POST').then(res => {
      //if (res.data) {}
      console.log('BarberOrderList');
      console.log(res.data.data);
      // success
      that.setData({ orders: res.data.data });
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
      that.setData({ orders: (wx.getStorageSync('orders') || []) });
    });
}

function getDataList_time(that) {
  console.log('getDataList ' + api.BarberSubscribeTimes);
  wx.showNavigationBarLoading();

  util.weshowRequest(
    api.BarberSubscribeTimes,
    {
      'size': 10,
      'barberid': that.data.barberID
    },
    'POST').then(res => {
      //if (res.data) {}
      console.log('getDataList 4444444444444444444444444444');
      console.log(res);
      // success
      that.setData({ timeToReserve: res.data.data.data });
      console.log(that.data.timeToReserve);
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
      that.setData({ timeToReserve: (wx.getStorageSync('timeToReserve') || []) });
    });
}

function updateBarberSubscribe(that, slot, select) {
  console.log('updateBarberSubscribe ' + api.BarberSubscribeManage);
  //wx.showNavigationBarLoading();

  util.weshowRequest(
    api.BarberSubscribeManage,
    {
      'size': 10,
      'barberid': app.globalData.userid,
      'data': that.data.timeToReserve,
      'unavailable_time': slot,
      'slot_status': select
    },
    'POST').then(res => {
      //if (res.data) {}
      console.log('updateBarberSubscribe');
      console.log(res);
      // success
      that.stopRefreshing();
      //that.waitUpdate();
    }).catch((err) => {
      console.log('getDataList err' + err);
    });
}

function select0(that, event) {
  var id = event.currentTarget.id;
  console.log('select0 ' + id);
  //console.log(event)
  var temp = that.data.timeToReserve;
  console.log('slot0 ' + temp.list[id].slot0);
  temp.list[id].select0 = 1 - temp.list[id].select0;
  that.setData({ timeToReserve: temp });
  updateBarberSubscribe(that, temp.list[id].slot0, temp.list[id].select0);
}

function select1(that, event) {
  var id = event.currentTarget.id;
  console.log('select1 ' + id);
  //console.log(event)
  var temp = that.data.timeToReserve;
  temp.list[id].select1 = 1 - temp.list[id].select1;
  that.setData({ timeToReserve: temp });
  updateBarberSubscribe(that, temp.list[id].slot1, temp.list[id].select1);
}

function select2(that, event) {
  var id = event.currentTarget.id;
  console.log('select2 ' + id);
  //console.log(event)
  var temp = that.data.timeToReserve;
  temp.list[id].select2 = 1 - temp.list[id].select2;
  that.setData({ timeToReserve: temp });
  updateBarberSubscribe(that, temp.list[id].slot2, temp.list[id].select2);
}

function backToprevPage(that) {
  wx.switchTab({
    url: '../PersonalHome/PersonalHome',
  })
}

function changeToCustomer(that) {
  that.setData({
    userType: 2
  });
}

function goToMyOrders() {
  wx.navigateTo({
    url: '../myOrders/orders',
  })
}

function goToMyCustomers() {
  wx.navigateTo({
    url: '../myCustomers/customers',
  })
}

function gotoCashdraw() {
  wx.navigateTo({
    url: '../cashdraw/cashdraw',
  })
}


module.exports = {
  getDataList_details,
  getDataList_reservations,
  getDataList_orders,
  getDataList_time,
  goToMyCustomers,
  goToMyOrders,
  gotoCashdraw,
  backToprevPage,
  changeToCustomer,
  updateBarberSubscribe,
  select0,
  select1,
  select2,
}