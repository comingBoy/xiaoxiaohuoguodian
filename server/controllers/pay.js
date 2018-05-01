const request = require('request')

function paysignjs(appid, nonceStr, package, signType, timeStamp) {
  var ret = {
    appId: appid,
    nonceStr: nonceStr,
    package: package,
    signType: signType,
    timeStamp: timeStamp
  };
  var string = raw1(ret);
  string = string + '&key=lilinfenglilinfenglilinfeng12345';
  console.log(string)
  var crypto = require('crypto');
  return crypto.createHash('md5').update(string, 'utf8').digest('hex');
};

function raw1(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

function paysignjsapi(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
  var ret = {
    appid: appid,
    body: body,
    mch_id: mch_id,
    nonce_str: nonce_str,
    notify_url: notify_url,
    openid: openid,
    out_trade_no: out_trade_no,
    spbill_create_ip: spbill_create_ip,
    total_fee: total_fee,
    trade_type: trade_type
  };
  var string = raw(ret);
  string = string + '&key=lilinfenglilinfenglilinfeng12345';
  var crypto = require('crypto');
  return crypto.createHash('md5').update(string, 'utf8').digest('hex');
};

function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

function getXMLNodeValue(node_name, xml) {
  var tmp = xml.split("<" + node_name + ">");
  var _tmp = tmp[1].split("</" + node_name + ">");
  return _tmp[0];
};

var getData = function (url, formData, appid, ctx, nonce_str) {
  return new Promise(function (resolve, reject) {
    request({
      url: url,
      method: 'POST',
      body: formData
    }, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        var prepay_id = getXMLNodeValue('prepay_id', body.toString("utf-8"));
        var tmp = prepay_id.split('[');
        var tmp1 = tmp[2].split(']');
        var timeStamp = new Date().getTime().toString()
        //签名
        var _paySignjs = paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp);
        ctx.body = {
          status: 1,
          timeStamp: timeStamp,
          package: 'prepay_id=' + tmp1[0],
          appId: appid,
          nonceStr: nonce_str,
          paySign: _paySignjs
        }
        resolve()
      } else {
        var payParam = 'error'
        ctx.body = {
          status: 0
        }
        reject('===error===');
      }
    })
  })
}

module.exports = {
  getPrepayId: async ctx => {
    let req = ctx.request.body
    var bookingNo = req.bookingNo
    var total_fee = req.total_fee
    var openId = req.openId
    var appid = "wx5dd90f6193e38265"
    var body = req.body
    var nonce_str = "MIXIMIXI1024"
    var mch_id = "1502037261"
    var notify_url = "https://lmeazhla.qcloud.la/weapp/notify"
    var spbill_create_ip = "172.20.30.155"
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>"; //appid
    formData += "<body>" + body + "</body>";
    formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>";
    formData += "<notify_url>" + notify_url + "</notify_url>";
    formData += "<openid>" + openId + "</openid>";
    formData += "<out_trade_no>" + bookingNo + "</out_trade_no>";
    formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
    formData += "<total_fee>" + total_fee + "</total_fee>";
    formData += "<trade_type>JSAPI</trade_type>";
    formData += "<sign>" + paysignjsapi(appid, body, mch_id, nonce_str, notify_url, openId, bookingNo, spbill_create_ip, total_fee, 'JSAPI') + "</sign>";
    formData += "</xml>";
    var url = "https://api.mch.weixin.qq.com/pay/unifiedorder"
    await getData(url, formData, appid, ctx, nonce_str)
  },

  notify: async ctx => {
    console.log("支付通知")
    console.log(ctx.request.body.xml)
    var payCallback = ctx.request.body.xml
    if (payCallback.return_code[0] == 'SUCCESS') {
      //获取订单信息
      //校验信息是否正确
      var return_code = 'SUCCESS'
      var formData = "<xml>"
      //formData += "<return_code>" + return_code + "</return_code>"
      formData = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>"
      console.log(formData)
      ctx.body = formData
    } else {
      console.log(payCallback.return_msg[0])
    }
  }

}
