var mysqlHelper = require("./mysqlHelper.js")

module.exports = {

  //提交订单具体菜品
  async newOrderFood(args) {
    let sql = 'INSERT INTO orderFooddb(shopId, orderId, foodId, foodName, singlePrice, orderNum, date, foodProperty) VALUE(?,?,?,?,?,?,?,?)'
    let params = [args.shopId, args.orderId, args.foodId, args.foodName, args.singlePrice, args.orderNum, args.date, args.foodProperty]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //删除订单具体菜品
  async delOrderFood(args) {
    let sql = 'DELETE FROM orderFooddb WHERE orderId = ? and shopId = ? and date = ?'
    let params = [args.orderId, args.shopId, args.date]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取订单具体菜品
  async getOrderFood(args) {
    let sql = 'SELECT * FROM orderFooddb WHERE orderId = ? and shopId = ? and date = ?'
    let params = [args.orderId, args.shopId, args.date]
    let result = await mysqlHelper.query(sql, params)
    return result
  },
}