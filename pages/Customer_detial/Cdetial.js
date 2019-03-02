// pages/Customer_detial/Cdetial.js
//获取应用实例
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var PersonalHome = require('../PersonalHome/PersonalHome.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userType: 2,
    customer_detail:[],
    cost_list:[],
    cost_count: 0,
    barberid: null,
    flag: null  ,//是否结束理发标志
    time: null,
    access: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.setData({
    //   barberid: PersonalHome.data.barberID
    // })
    console.log(PersonalHome.data)
    if (options.customer_id){
      that.setData({
        id: options.customer_id,
        userType: app.globalData.userType
      })
    }
    else{
      that.setData({
        id: app.globalData.userid,
        userType: app.globalData.userType
      })
    }
    console.log("*****************************************************")
    console.log(that.data)
    that.getDataList_customer();
    that.getDataList_cost();
  },

  // 获取数据列表
  getDataList_customer: function () {
    console.log('getDataList ' + api.StoreCustomerDetail);
    wx.showNavigationBarLoading();
    var that = this;
   
    util.weshowRequest(
      api.StoreCustomerDetail,
      {
        'size': 10,
        'customerid': that.data.id
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res);
        // success
        var curTime = util.getCurrentSecond()
        that.setData({ 
          customer_detail: res.data      
          });
        // console.log(that.data);
        that.stopRefreshing();
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
        that.setData({ customer_detail: (wx.getStorageSync('customer_detail') || []) });
      });
  },

  // 获取数据列表
  getDataList_cost: function () {
    console.log('getDataList ' + api.CustomerOrderList);
    console.log(this.data.id);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.CustomerOrderList,
      {
        'size': 10,
        'customerid': that.data.id,
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList_cost ');
        console.log(res);
        // success
        that.setData({ 
          cost_list: res.data.data.list,
          cost_count: res.data.data.list.length
        });
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
        that.setData({ cost_list: (wx.getStorageSync('cost_list') || []) });
      });
  },

// 开始理发
  startService:function(){
    console.log('getDataList ' + api.StartService);
    wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StartService,
      {
        'size': 10,
        'customerid': that.data.customer_detail.openid,
        'barberid': app.globalData.userid
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getDataList ');
        console.log(res.data);
        if (res.data.errorCode == 10013) {
          wx.showModal({
            title: '出错了',
            content: '当前顾客未在理发位置，请确认',
          })
        }
        that.getDataList_customer();
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
        // that.setData({ cost_list: (wx.getStorageSync('cost_list') || []) });
      });
  },

  // 结束理发
  endService:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定结束理发服务吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定') 
          that.endService_upload();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

 endService_upload:function(){
   var that = this;
   console.log('getDataList ' + api.EndService);
   wx.showNavigationBarLoading();
   util.weshowRequest(
     api.EndService,
     {
       'size': 10,
       'customerid': that.data.customer_detail.openid,
       'barberid': app.globalData.userid
     },
     'POST').then(res => {
       //if (res.data) {}
       console.log('getDataList ');
       console.log(res);
       that.getDataList_customer();
       wx.navigateTo({
         url: '../endService/end?orderid='+res.data.data.orderid,
       })
     }).catch((err) => {
       console.log('getDataList err' + err);
       // that.setData({ cost_list: (wx.getStorageSync('cost_list') || []) });
     });
 },

  backToprevPage: function () {
    wx.navigateBack({
    })
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  sendInfo:function(){
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxba71617fb1ac4213&secret=aa2c4031799c35fb656da3ea2a0071b3',
      success: function (res) {
        console.log(res)
        that.setData({
          access: res.data.access_token
        })
      }
    })
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+that.data.access,
      method: 'POST',
      "touser": that.data.id,//用户的openid
      "template_id": 'PRO3ST6aZ9H5wrBOGWRBrUdh86hUqnvC2OlW8tveYbg',//模板id
      "page": "pages/PersonalHome/PersonalHome",
      "form_id": formid,//表单id
      "data": {
        "keyword1": {
          "单号": '',
          "金额": ''
        },
        "keyword2": {
          "value": gettime()
        },
      },
      "emphasis_keyword": "keyword1.DATA" //将keyword1放大
    })
  }
})