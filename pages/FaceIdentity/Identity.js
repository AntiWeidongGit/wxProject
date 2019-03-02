// pages/FaceIdentity/Identity.js
//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    src: null,
    position: 'front',
    faceid: null
  },

 onLoad:function(options){
  //  if (app.globalData.userType == 1) {
  //    wx.navigateTo({
  //      url: '../BarBer/personal',
  //    })
  //  }
 },

  //拍照事件处理
  takePhoto: function () {
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          this.setData({
            src: res.tempImagePath
          })
         
          this.getFaceId();
         
          wx.navigateTo({
            url: '../IDConfirm/IDConfirm',
          })
        }
      })
    } ,    

  switchCamera: function () {
    var that = this;
    if (that.data.position == 'front') {
      that.setData({
        position: 'back'
      })
    }
    else {
      that.setData({
        position: 'front'
      })
    }
  },

  backToprevPage: function () {
    wx.navigateBack({
    })
    // wx.switchTab({
    //   url: '../LoginMain/LoginMain'
    // })
  },

  getFaceId: function () {
    var that = this;
    wx.uploadFile({
      url: api.GetFaceId,
      filePath: that.data.src,
      name: 'face_image',
      formData: {
        'appid': app.globalData.appid,
        'openid': app.globalData.userid,
        'timestamp': util.getCurrentSecond()
      },
      success: function (res) {
        console.log('********************************************')
        console.log(res)
        var data = JSON.parse(res.data)
        console.log(data)
        if (data != null && data.error_code == 0) {
          that.setData({
            faceid: data.result.user_list[0].user_id
          })
          //app.globalData.userid = data.data.openid
          app.globalData.faceid = data.result.user_list[0].user_id
          console.log('********************************************')
          console.log(app.globalData.faceid)
          that.stopRefreshing();
        }
        else{
          wx.showModal({
            title: '提示',
            content: '未识别出人脸，请确保人像清晰完整。点击人像区域重新进行拍摄！',
          })
        }
      },
      fail: function (res) {

      }
    })
  },

  switchCamera: function () {
    var that = this;
    if (that.data.position == 'front') {
      that.setData({
        position: 'back'
      })
    }
    else {
      that.setData({
        position: 'front'
      })
    }
  },

  stopRefreshing: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  }
})