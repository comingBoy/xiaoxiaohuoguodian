var net = require('./net.js')
var config = require('../config.js')

module.exports = {
  /*
  data = {
    shopId
  }
  */
  getShopInfo: function (data, callback) {
    net.request(data, config.service.getShopInfoUrl, function (res) {
      callback(res.data)
    })
  },

  changeShopTime: function (data, callback) {
    net.request(data, config.service.changeShopTimeUrl, function (res) {
      callback(res.data)
    })
  },

  changeShopStatus: function (data, callback) {
    net.request(data, config.service.changeShopStatusUrl, function (res) {
      callback(res.data)
    })
  },
}