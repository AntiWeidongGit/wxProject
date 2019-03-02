
var api = require('../../config/api.js');
var model = require('../../utils/model.js');
var util = require('../../utils/util.js');
var md5 = require('../../utils/md5.js');
var wxpay = require('../../utils/wxpay.js');

var app = getApp();

Page({
  data: {
    userid: app.globalData.userid,
    balance: 0.0,
    drawValue: 10.0,
    cashdrawData: {},
    hasDraw: false,
  },


  onLoad: function () {
    this.setData({
      userid: app.globalData.userid
    });
  },

  onShow: function () {
    this.getCashDrawData(this.data.userid);
    this.setData({
      balance: app.globalData.accountInfo.balance
    });
  },

  drawInputEvent: function (e) {
    var val = e.detail.value;
    if (val > this.data.balance) {
      val = this.data.balance;
    }
    this.setData({
      drawValue: val
    });
  },

  getCashDrawData: function (uid) {
    var that = this;
    console.log('getCashDrawData');
    console.log(uid);
    console.log(app.globalData.userid);
    util.weshowRequest(api.BarberBlance,
      {
        'openid': uid
      }, 'POST').then(res => {
        console.log("BarberBlance");
        console.log(res);
        that.setData({
          balance: res.data.data.balance,
          hasDraw: res.data.data.hasDraw
        });
        // success
      }).catch((err) => {
        // fail
        console.log(err);
      });
  },

  cashDrawEvent: function (event) {
    console.log('cashDrawEvent');
    if (this.data.balance < 10.0) {
      return;
    }
    if (this.data.hasDraw) {
      return;
    }
    if (util.hasButtonClicked()) {
      return;
    }
    this.addCashDraw(this.data.drawValue);
    //this.cashDraw();
  },

  addCashDraw: function(val) {
    var that = this;
    util.weshowRequest(api.BarberCashdraw,
      {
        'openid': app.globalData.userid,
        'username': model.getMyUserName(),
        'cash_val': val,
        'draw_type': 2,
        'note': 'draw',
        'add_time': ((new Date()).getTime() / 1000)
      },
      'POST').then(res => {
        console.log(res);
        //do something
        that.getCashDrawData(that.data.userid);
        util.showDialog('提现请求提交成功，请等待审核结果');

      }).catch((err) => {
        // fail
        util.showDialog('提现请求提交失败');
      });
  },

  cashDraw: function () {
    console.log('cashDraw');
    //this.mmtransfer(1, util.getCurrentSecond());
    wxpay.startMmTransfer(1, util.getCurrentSecond()).then(res1 => {
      console.log(res1);
    }).catch((err1) => {
      console.log(err1);
    });
  },

  mmtransfer: function (amount, tradeNumber) {
    var that = this;
    var body = 'QuestionPaltform';//商户名
    var check_name = 'FORCE_CHECK';
    var desc = '红包';
    var mch_appid = app.globalData.appid;
    var mchid = '1497874882';//商户号
    var nonce_str = util.getRandomString();
    var notify_url = api.PayNotifyUrl;//通知地址
    var openid = app.globalData.userid;
    var re_user_name = model.getMyUserName();
    var sign_type = 'MD5';
    var spbill_create_ip = '192.168.0.1';//ip
    //var trade_type = "JSAPI";
    var key = app.globalData.payKey;
    var unifiedPayment = 'amount=' + amount + '&body=' + body + '&check_name=' + check_name
      + '&desc=' + desc + '&mch_appid=' + mch_appid + '&mchid=' + mchid
      + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid
      + '&partner_trade_no=' + tradeNumber + '&re_user_name=' + re_user_name + '&sign_type=' + sign_type
      + '&spbill_create_ip=' + spbill_create_ip
      + '&key=' + key;
    console.log(unifiedPayment);
    //console.log('md5');
    var sign = md5.hexMD5(unifiedPayment).toUpperCase();
    console.log(sign);

    util.weshowRequest(api.WxPayMmTransfer,
      {
        'amount': amount,
        'mch_appid': app.globalData.appid,
        'nonce_str': util.getRandomString(),
        'notify_url': api.PayNotifyUrl,
        'openid': app.globalData.userid,
        'partner_trade_no': tradeNumber,
        're_user_name': model.getMyUserName(),
        'sign': sign
      }, 'POST').then(res1 => {
        console.log(res1);
      }).catch((err1) => {
        console.log(err1);
      });
  },
})
