var net = require('./net.js')
var config = require('../config.js')

module.exports = {
  
  /*提交订单
  data = {
    openId,
    shopId,
    shopName,
    tableId,
    cost,
    date,
    time,
    period,
    ifEatHere,
    ifFinish(0),
    orderFood:[
      {
        foodId,
        foodName,
        singlePrice,
        orderNum,
        foodProperty
      },
      ...
    ]
  }
  */
  newOrder: function (data, callback) {
    net.request(data, config.service.newOrderUrl, function (res) {
      callback(res.data)
    })
  },

  /*完成订单
  data = {
    id
  }
  */
  finishOrder: function (data, callback) {
    net.request(data, config.service.finishOrderUrl, function (res) {
      callback(res.data)
    })
  },

  //获取订单
  getOrder: function (data, callback) {
    net.request(data, config.service.getOrderUrl, function (res) {
      callback(res.data)
    })
  },

  //获取我的订单
  getMyOrder: function (data, callback) {
    net.request(data, config.service.getMyOrderUrl, function (res) {
      callback(res.data)
    })
  },
}