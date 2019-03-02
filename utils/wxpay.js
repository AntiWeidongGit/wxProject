    /* 
     * A JavaScript implementation of Wx Pay Precess. 
     */  
 
    /* 
     * API. 
     */
var app = getApp();
var api = require('../config/api.js');
var md5 = require('./md5.js');
var xmlParser = require('../lib/xmldom/dom-parser');


function getCurrentSecond() {
  return Math.floor((new Date()).getTime() / 1000);
}

function getSecurityTimestamp() {
  return parseInt((new Date()).getTime() / 1000);
}

function getNonce() {
  return Math.round(Math.random() * 100000);
}

/* 随机数 */
function getRandomString() {
  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  var maxPos = chars.length;
  var pwd = '';
  for (var i = 0; i < 32; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function startPayFromServer(fee, paySn) {
  return new Promise(function (resolve, reject) {
    console.log('startPay');
    wx.request({
      url: api.GetWxPayUnified,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-Weshow-Token': wx.getStorageSync('token')
      },
      data: {
        'fee': fee,
        'pay_sn': paySn,
        'nonce': getRandomString(),
        'openid': app.globalData.userid
      },
      success: function (res) {
        console.log(res);
        var param = onUnifiedorderResult(res);
        callWxPay(param).then(res => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      },
      fail: function (res) {
        // fail
        console.log(res);
        reject(res);
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })
  })
}
function startPay(fee, paySn) {
  return new Promise(function (resolve, reject) {
    console.log('startPay');
    //统一支付签名
    var appid = app.globalData.appid;
    var body = 'QuestionPaltform';//商户名
    var mch_id = '1497874882';//商户号
    var nonce_str = getRandomString();
    var notify_url = api.PayNotifyUrl;//通知地址
    var openid = app.globalData.userid;
    var sign_type = 'MD5';
    var spbill_create_ip = '123.11.11.123';//ip
    var trade_type = "JSAPI";
    var key = app.globalData.payKey;
    var unifiedPayment = 'appid=' + appid + '&body=' + body + '&mch_id=' + mch_id
      + '&nonce_str=' + nonce_str + '&notify_url=' + notify_url + '&openid=' + openid
      + '&out_trade_no=' + paySn + '&sign_type=' + sign_type + '&spbill_create_ip=' + spbill_create_ip
      + '&total_fee=' + fee + '&trade_type=' + trade_type + '&key=' + key;
    //unifiedPayment = "appid=wxd930ea5d5a258f4f&body=test&device_info=1000&mch_id=10000100&nonce_str=ibuaiVcKdpRxkhJA";
    //unifiedPayment = unifiedPayment + "&key=192006250b4c09247ec02edce69f6a2d";
    console.log(unifiedPayment);
    //console.log('md5');
    var sign = md5.hexMD5(unifiedPayment).toUpperCase();
    console.log(sign);
    console.log(api.WxPayUniUrl);

    //封装统一支付xml参数  
    var formData = "<xml>"
    formData += "<appid>" + appid + "</appid>"
    formData += "<body>" + body + "</body>"
    formData += "<mch_id>" + mch_id + "</mch_id>"
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"
    formData += "<notify_url>" + notify_url + "</notify_url>"
    formData += "<openid>" + openid + "</openid>"
    formData += "<out_trade_no>" + paySn + "</out_trade_no>"
    formData += "<sign_type>" + sign_type + "</sign_type>"
    formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
    formData += "<total_fee>" + fee + "</total_fee>"
    formData += "<trade_type>" + trade_type + "</trade_type>"
    formData += "<sign>" + sign + "</sign>"
    formData += "</xml>"

    //统一支付
    wx.request({
      url: api.WxPayUniUrl,
      method: 'POST',
      head: 'application/x-www-form-urlencoded',
      data: formData, // 设置请求的 header
      success: function (res) {
        console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
        console.log(res);
        var param = onUnifiedorderResult(res);
        callWxPay(param).then(res => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      },
      fail: function (res) {
        // fail
        console.log(res);
        reject(res);
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })
  })
}

function onUnifiedorderResult(res) {
  console.log('onUnifiedorderResult');
  var xParser = new xmlParser.DOMParser();
  var doc = xParser.parseFromString(res.data.toString("utf-8"));
  var resultCode = doc.getElementsByTagName('result_code')[0].firstChild.nodeValue;
  console.log(resultCode);
  //var result_code = getXMLNodeValue('result_code', res.data.toString("utf-8"))
  //var resultCode = result_code.split('[')[2].split(']')[0]
  if (resultCode == 'FAIL') {
    //var err_code_des = getXMLNodeValue('err_code_des', res.data.toString("utf-8"))
    //var errDes = err_code_des.split('[')[2].split(']')[0]
    var errDes = doc.getElementsByTagName('err_code_des')[0].firstChild.nodeValue;
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面  
      success: function (res) {
        wx.showToast({
          title: errDes,
          icon: 'success',
          duration: 2000
        })
      },
    })
    return null;
  } else {
    //发起支付
    //var prepay_id = getXMLNodeValue('prepay_id', res.data.toString("utf-8"))
    //var tmp = prepay_id.split('[')
    //var tmp1 = tmp[2].split(']')
    var prepay_id = doc.getElementsByTagName('prepay_id')[0].firstChild.nodeValue;
    console.log(prepay_id);
    //签名
    var key = app.globalData.payKey;
    var appId = app.globalData.appid;
    var timeStamp = getCurrentSecond() + '';
    var nonceStr = getRandomString();
    var strPaySign = 'appId=' + appId + '&nonceStr=' + nonceStr
      + '&package=prepay_id=' + prepay_id + '&signType=MD5&timeStamp=' + timeStamp + '&key=' + key;
    //strSign = 'appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111';
    var paySign = md5.hexMD5(strPaySign).toUpperCase();
    //var sign = doc.getElementsByTagName('sign')[0].firstChild.nodeValue;
    console.log(strPaySign);
    console.log(paySign);
    var param = {
      "timeStamp": timeStamp, "package": 'prepay_id=' + prepay_id,
      "paySign": paySign, "signType": 'MD5', "nonceStr": nonceStr
    }
    return param;
  }
}
  
/* 获取prepay_id */
function getXMLNodeValue(node_name, xml) {
  if (!xml) {
    return null;
  }
  console.log('getXMLNodeValue   ' + node_name);
  var tmp = xml.split("<" + node_name + ">");
  console.log(tmp);
  var _tmp = tmp[1].split("</" + node_name + ">");
  console.log(_tmp[0]);
  return _tmp[0];
}

function callWxPay(param) {
  console.log('callWxPay ');
  return new Promise(function (resolve, reject) {
    if (param == null) {
      reject(null);
      return;
    }
    wx.requestPayment({
      'timeStamp': param.timeStamp,
      'nonceStr': param.nonceStr,
      'package': param.package,
      'signType': 'MD5',
      'paySign': param.paySign,
      'success': function (res) {
        console.log('callWxPay success');
        console.log(res);
        resolve(res);
      },
      'fail': function (err) {
        console.log(err);
        reject(err);
      }
    })
  })
}


function startMmTransfer(amount, tradeNumber) {
  return new Promise(function (resolve, reject) {
    console.log('startMmTransfer');
    //var amount = fee;
    var body = 'QuestionPaltform';//商户名
    var check_name = 'FORCE_CHECK';
    var desc = '红包';
    var mch_appid = app.globalData.appid;
    var mchid = '1497874882';//商户号
    var nonce_str = getRandomString();
    var notify_url = api.PayNotifyUrl;//通知地址
    var openid = app.globalData.userid;
    var re_user_name = app.globalData.accountInfo.name;
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

    //封装xml参数  
    var formData = "<xml>"
    formData += "<amount>" + amount + "</amount>"
    formData += "<body>" + body + "</body>"
    formData += "<check_name>" + check_name + "</check_name>"
    formData += "<desc>" + desc + "</desc>"
    formData += "<mch_appid>" + mch_appid + "</mch_appid>"
    formData += "<mchid>" + mchid + "</mchid>"
    formData += "<nonce_str>" + nonce_str + "</nonce_str>"
    formData += "<notify_url>" + notify_url + "</notify_url>"
    formData += "<openid>" + openid + "</openid>"
    formData += "<partner_trade_no>" + tradeNumber + "</partner_trade_no>"
    formData += "<re_user_name>" + re_user_name + "</re_user_name>"
    formData += "<sign_type>" + sign_type + "</sign_type>"
    formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
    formData += "<sign>" + sign + "</sign>"
    formData += "</xml>"

    //企业付款
    wx.request({
      url: api.WxPayTransfersUrl,
      method: 'POST',
      head: 'application/x-www-form-urlencoded',
      ca: [api.CA_CERT],
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Weshow-Token': wx.getStorageSync('token')
      },
      data: formData, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        resolve(res);
      },
      fail: function (res) {
        // fail
        //console.log(res);
        reject(res);
      },
      complete: function (res) {
        // complete
        //console.log(res);
      }
    })
  })
}

module.exports = {  
  startPay: startPay,
  startMmTransfer: startMmTransfer
}
