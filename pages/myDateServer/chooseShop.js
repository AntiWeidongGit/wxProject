// pages/myCustomers/chooseShop.js
var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:0,
    currentTab:0,
    postion:'',
    clickRadio:'',
    // shopList: [{ name: "店一", address: "北京", ImgSrc: "asdfsdfasf", distance: [12.34, 32.45] }, { name: "店二", address: "上海", ImgSrc: "asdfsdfasf", distance: [12.345, 32.45] }, { name: "店二", address: "上海", ImgSrc: "asdfsdfasf", distance: [12.34, 32.45] }, { name: "店二", address: "上海", ImgSrc: "asdfsdfasf", distance: [12.34, 32.45] }]
    shopList:""
  },
  choiceTime:function(e){
    var page = this;
    var id = e.target.id;
    if (this.data.currentTab == id) {
      return false;
    } else {
      page.setData({
        currentTab: id,
        postion:id
      })
    
    }
    console.log(this.data.postion);
    page.setData({ flag: id });
  },
  returnToServer:function(){
    wx.navigateTo({
      url: 'myDateServer',
    })
  },

  toServerInfo:function(){
    wx.navigateTo({
      url: 'DateServerInfo?time=' + this.data.postion + '&clickRadio=' +        this.data.clickRadio,
    })
  },
  checkboxChange:function(e){
    console.log(e.detail.value);
    var that=this;
    that.setData({
      clickRadio:e.detail.value
    })
  },
  wxPay:function(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStoreList();
  },
  getStoreList: function () {
    console.log('getStoreList ' + api.StoreList);
    //wx.showNavigationBarLoading();
    var that = this;
    var bizContent = {
      'start': "5",
      'limit': "5",
      'category': "1",
      'orderType': "1"
    }
    util.weshowRequest(api.StoreList, bizContent ,'POST');
    console.log("调用weshow");
    // util.weshowRequest(
    //   api.StoreList,
      // {
        // 'size': 10,
        // 'customerid': app.globalData.userid
      
      //   'start':"5",
      //   'limit': "5",
      //   // 'longitude':"",
      //   // 'latitude':"",
      //   'category':"1",
      //   'orderType':"1"
      // },
    
    //   'POST').then(res => {
    //     //if (res.data) {}
    //     console.log("shopList+res");
    //     console.log(res);
    //     // success
    //     that.setData({shopList: res.data.data.list});
    //     console.log(that.data);
    //     that.stopRefreshing();
    //     //that.waitUpdate();
    //   }).catch((err) => {
    //     console.log('shopList  err' + err);
    //     // fail
    //     // that.stopRefreshing();
    //     wx.showToast({
    //       title: '正在获取数据…',
    //       icon: 'loading',
    //       duration: 3000,
    //       mask: true
    //     });
    //   });
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