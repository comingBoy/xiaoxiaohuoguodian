var net = require('./net.js')
var config = require('../config.js')

module.exports = {
  /*获取菜品种类列表
  data = {
    shopId
  }
  */
   getFoodTypeList: function(data, callback) {
    net.request(data, config.service.getFoodTypeUrl, function (res) {
      callback(res.data)
    })
  },

   newFoodType: function (data, callback) {
     net.request(data, config.service.newFoodTypeUrl, function (res) {
       callback(res.data)
     })
   },
}