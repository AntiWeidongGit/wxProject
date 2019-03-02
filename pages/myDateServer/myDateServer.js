// pages/myCustomers/customers.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [{ name: "染发", value: "染发", money: "39", moneyYuan: "50" },
      { name: "染发2", value: "染发2", money: "39", moneyYuan: "50" }, 
      { name: "染发2", value: "染发2", money: "39", moneyYuan: "50" }],
    item2: [{ name: "烫发1", value: "烫发1", money: "39", moneyYuan: "50" },
      { name: "烫发2", value: "烫发2", money: "39", moneyYuan: "50"},
      { name: "染发3", value: "染发3", money: "39", moneyYuan: "50" }],
    explain:"七折",
    serviceDisplay:"",
    otherDisplay:"",
    ranfa:"display:none",
    tangfa: "display:none",
    clickServer:''
  },
  getServiceList: function () {
    console.log('getServicetList ' + api.StoreList);
    //wx.showNavigationBarLoading();
    var that = this;

    util.weshowRequest(
      api.StoreList,
      {
        // 'size': 10,
        // 'customerid': app.globalData.userid
        'start': 10,
        'limit': 10,
        // 'longitude':"",
        // 'latitude':"",
        'category': 1,
        'orderType': 1
      },
      'POST').then(res => {
        //if (res.data) {}
        console.log('getShopList ');
        console.log(res);
        // success
        that.setData({ shopList: res.data.data.list });
        // console.log(that.data);
        // that.stopRefreshing();
        //that.waitUpdate();
      }).catch((err) => {
        console.log('getShopList err' + err);
        // fail
        // that.stopRefreshing();
        
        wx.showToast({
          title: '正在获取数据…',
          icon: 'loading',
          duration: 3000,
          mask: true
        });
      });
  },
  return:function(){
       
  },
  serviceList:function(){
     var that=this;
     that.setData({
       serviceDisplay:"",
       otherDisplay:"display:none"
     })
  },
  otherList:function(){
    var that = this;
    that.setData({
      serviceDisplay: "display:none",
      otherDisplay: ""
    })
  },
  ranfa:function(){
    var that=this;
    if(this.data.ranfa=="display:none"){
 
    that.setData({
      ranfa:""
    })
  
    } else{
      that.setData({
        ranfa: "display:none"
      })
    
  }
  },
 tangfa: function () {
    var that = this;
    if (this.data.tangfa == "display:none") {

      that.setData({
        tangfa: ""
      })
     
    } else {
      that.setData({
        tangfa: "display:none"
      })
     
    }
  },
  checkboxChange: function (e) {
    console.log(e.detail.value);
    var that = this;
    that.setData({
      clickServer: e.detail.value
    })
    console.log("clickServer:"+this.data.clickServer);
  },
  toChoShop:function(){
 
    wx.navigateTo({
      url: 'chooseShop',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  this.getServiceList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})