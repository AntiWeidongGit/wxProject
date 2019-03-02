// pages/Reservation/reserve.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    barberId: null,
    barberInfo: [],
    // timeToReserve: [{ morning: '今天上午', afternoon: '今天下午', night: '今天晚上' }, { morning: '明天上午', afternoon: '明天下午', night: '明天晚上' }, { morning: '后天上午', afternoon:'后天下午', night:'后天晚上'}],
    timeToReserve: null,
    works: [],
    time: null,
    flag: false  //是否可以点击预约按钮的标志
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      barberId: options.barberid
    })
    console.log(that.data.barberId)
    that.getDataList_barber()
    that.getDataList_time()
    that.getDataList_works()
  },

  getDataList_barber: function () {
    console.log('getDataList ' + api.StoreBarberDetail);
    wx.showNavigationBarLoading();
    var that = this;
    util.weshowRequest(
      api.StoreBarberDetail,
      {
        'size': 10,
        'barberid': that.data.barberId
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res);
        // success
        that.setData({ barberInfo: res.data });
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
        that.setData({ barberInfo: (wx.getStorageSync('barberInfo') || [])});
      });
  },

  getDataList_time :function () {
    console.log('getDataList ' + api.BarberSubscribeTimes);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.BarberSubscribeTimes,
      {
        'size': 10,
        'barberid': that.data.barberId
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res);
        // success
        that.setData({ timeToReserve: res.data.data.data.list });
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
        that.setData({ timeToReserve: (wx.getStorageSync('timeToReserve') || []) });
      });
  },

  getDataList_works: function () {
    console.log('getDataList ' + api.BarberOrderList);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.BarberOrderList,
      {
        'size': 10,
        'barberid': that.data.barberId
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

  goToSubscribe:function(){
    if(this.data.flag==true){
      wx.navigateTo({
        url: '../Subscribe_action/subscribe?time='+this.data.time,
      })
    }else{
     wx.showModal({
       title: '提示',
       content: '请先选择预约时间哦！',
     })
    }
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  updateReservationColor: function(index, itemid) {
    var list = this.data.timeToReserve;
    for (var i = 0; i < list.length; i++) {
      list[i].selected0 = 0;
      list[i].selected1 = 0;
      list[i].selected2 = 0;
    }
    if (itemid == 0) {
      list[index].selected0 = 1;
    }
    else if (itemid == 1) {
      list[index].selected1 = 1;
    }
    else if (itemid == 2) {
      list[index].selected2 = 1;
    }
    this.setData({ timeToReserve : list});
  },

  select0: function (event) {
    var that = this;
    var id=event.currentTarget.dataset.id.select0;
    var value = event.currentTarget.dataset.id.slot0;
    console.log('select0 ' + value);
    console.log(event);
    if(id==1){
      that.setData({
        flag:true,
        time:value
      })
      that.updateReservationColor(event.currentTarget.id, 0);
    }else{
      wx.showModal({
        title: '提示',
        content: '您只能点击蓝色时段进行预约哦！',
      })
      that.setData({
        flag:false
      })
    }
  },

  select1: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id.select1;
    var value = event.currentTarget.dataset.id.slot1;
    console.log('select1 ' + value);
    if (id == 1) {
      that.setData({
        flag: true,
        time: value
      })
      that.updateReservationColor(event.currentTarget.id, 1);
    } else {
      wx.showModal({
        title: '提示',
        content: '您只能点击蓝色时段进行预约哦！',
      })
      that.setData({
        flag: false
      })
    }
  },

  select2: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id.select2;
    var value = event.currentTarget.dataset.id.slot2;
    console.log('select2 ' + value);
    if (id == 1) {
      that.setData({
        flag: true,
        time: value
      })
      that.updateReservationColor(event.currentTarget.id, 2);
    } else {
      wx.showModal({
        title: '提示',
        content: '您只能点击蓝色时段进行预约哦！',
      })
      that.setData({
        flag: false
      })
    }
   }
})




 


