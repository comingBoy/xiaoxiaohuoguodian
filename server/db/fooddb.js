var mysqlHelper = require("./mysqlHelper.js")

module.exports = {

  //获取菜品某店某类菜品
  async getFoodList(args) {
    let sql = 'SELECT * FROM fooddb where foodTypeId = ? and shopId = ?'
    let params = [args.foodTypeId, args.shopId]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //上传菜品
  async newFood(args) {
    let sql = 'INSERT INTO fooddb(shopId, foodTypeId, foodName, leastPrice, priceProperty, multiProperty, singleProperty, foodPhoto, remark, ifSoldOut) VALUE(?,?,?,?,?,?,?,?,?,?)'
    let params = [args.shopId, args.foodTypeId, args.foodName, args.leastPrice, args.priceProperty, args.multiProperty, args.singleProperty, args.foodPhoto, args.remark, args.ifSoldOut]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //起停售菜品
  async changeSell(args) {
    let sql = 'UPDATE fooddb SET ifSoldOut = ? where foodId = ?'
    let params = [args.ifSoldOut, args.foodId]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

}