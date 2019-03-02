// pages/Dial/dial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone
    })
    this.calling();
    wx.navigateBack({ 
    })
  },

   calling: function () {
     var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }
})