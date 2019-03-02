var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
import myDialog from '../template/dialog';

var app = getApp();

  function onLogin(that, res) {
    if (res == null) {
      that.setData({
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      });
    }
    else {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
      })
      //getAccount(app.globalData.userid);
      userRegister();
    }
  }

  function saveUserInfo(that, userInfo) {
    console.log('saveUserInfo');
    app.globalData.userInfo = userInfo;
    app.globalData.hasUserInfo = true;
    wx.setStorageSync('userInfo', userInfo);
    util.addUserInfo();
    onLogin(that, userInfo);
  }

  function onGotUserInfo(that, e) {
    console.log('onGotUserInfo');
    console.log(e);
    if (e.detail.userInfo) {
      saveUserInfo(that, e.detail.userInfo);

      authorize(true, info => {
        console.log('authorize');
        console.log(info);
      });
      console.log('login redirect');
      console.log(app.globalData.faceid);
      if (app.globalData.faceid == null) {
        wx.redirectTo({
          url: '../FaceLogin/Login'
        });
      }
      else {
        that.setData({
          faceid: app.globalData.faceid
        });
      }
    }
  }

  /*
   * 授权获取用户信息
   * @withCredentials 是否带上登录态信息
   * @doSuccess 成功获取用户信息的回调
   */
function authorize(withCredentials, doSuccess) {
    // 通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
    wx.getSetting({
      success: res => {
        // 先判断用户是否授权获取用户信息，如未授权，则会弹出授权框
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          //_pageCxt.doWxGetUserInfo(withCredentials, doSuccess);
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              //_pageCxt.doWxGetUserInfo(withCredentials, doSuccess);
            },
            fail() {
              wx.showToast({
                title: '授权获取信息失败',
                icon: 'loading',
                duration: 1500
              });
            }
          });
        }
      }
    });
  }

function doWxGetUserInfo(_pageCxt, withCredentials, doSuccess) {
    console.log('doWxGetUserInfo')
    wx.getUserInfo({
      withCredentials: withCredentials,
      success: function (res) {
        console.log(res);
        app.globalData.userInfo = res.userInfo;
        app.globalData.hasUserInfo = true;
        wx.setStorageSync('userInfo', res.userInfo);
        _pageCxt.onLogin(res.userInfo);
        _pageCxt.onSuccess(res, doSuccess);
      },
      fail: function () {
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'loading',
          duration: 1200
        });
      }
    });
  }

  /**
   * 获取信息成功的回调
   */
  function onSuccess(data, doSuccess) {
    if (typeof doSuccess == 'function') {
      doSuccess(data);
    }
  }

  function getAccount(that, uid) {
    console.log("getAccount");
    console.log(uid);
    util.weshowRequest(api.UserInfo,
      {
        'userid': uid
      }, 'GET').then(res => {
        console.log(res);
        app.globalData.accountInfo = res.data;
        that.setData({ accountInfo: res.data });
        console.log("accountInfo");
        console.log(that.data.accountInfo);
        // success
      }).catch((err) => {
        // fail
        console.log(err);
      });
  }

  function userRegister() {
    console.log("userRegister");
    var faceid = app.globalData.faceid;
    if (faceid == null || faceid == '') {
      faceid = '0';
    }
    util.weshowRequest(api.UserRegister,
      {
        'userid': app.globalData.userid,
        'country': app.globalData.userInfo.country,
        'province': app.globalData.userInfo.province,
        'city': app.globalData.userInfo.city,
        'gender': app.globalData.userInfo.gender,
        'language': app.globalData.userInfo.language,
        'avatarUrl': app.globalData.userInfo.avatarUrl,
        'name': app.globalData.userInfo.nickName,
        'type': 2,
        'face_id': faceid
      }, 'POST').then(res => {
        console.log(res);
      }).catch((err) => {
        // fail
        console.log(err);
      });
  }


module.exports = {
  onLogin,
  userRegister,
  onGotUserInfo,
  authorize,
  doWxGetUserInfo,
  onSuccess,
  getAccount,
  userRegister,
}