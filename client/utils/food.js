var net = require('./net.js')
var config = require('../config.js')

module.exports = {
  
  /*获取菜品列表
  data = {
    shopId
  }
  */
  getFoodList: function (data, callback) {
    net.request(data, config.service.getFoodListUrl, function (res) {
      callback(res.data)
    })
  },

  /*后台获取菜品列表
data = {
  shopId
}
*/
  getFoodList0: function (data, callback) {
    net.request(data, config.service.getFoodList0Url, function (res) {
      callback(res.data)
    })
  },


  /*上传菜品
  data = {
    shopId,
    foodTypeId,
    foodName,
    leastPrice,
    priceProperty,
    multiProperty,
    singleProperty,
    foodPhoto,
    remark,
    ifSoldOut
  }
  */
  newFood: function (data, callback) {
    net.request(data, config.service.newFoodUrl, function (res) {
      callback(res.data)
    })
  },

  /*
  data = {
    foodId,
    ifSoldOut
  }
  */
  changeSell: function (data, callback) {
    net.request(data, config.service.changeSellUrl, function (res) {
      callback(res.data)
    })
  },
}