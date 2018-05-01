var config = require('../config.js')
var net = require('./net.js')

module.exports = {

  //获取prepayId
  getPrepayId: function (data, callback) {
    net.request(data, config.service.payUrl, function (res) {
      callback(res.data)
    })
  },
}