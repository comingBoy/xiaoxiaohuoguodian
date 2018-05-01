var mysqlHelper = require("./mysqlHelper.js")

module.exports = {

  //提交订单
  async newOrder(args) {
    let sql = 'INSERT INTO orderdb(openId, orderId, shopId, shopName, tableId, cost, date, time, period, ifEatHere, ifFinish) VALUE(?,?,?,?,?,?,?,?,?,?,?)'
    let params = [args.openId, args.orderId, args.shopId, args.shopName, args.tableId, args.cost, args.date, args.time, args.period, args.ifEatHere, args.ifFinish]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取订单ID
  async getOrderId(args) {
    let sql = 'SELECT orderId FROM orderdb where shopId= ?, tableId= ?, cost= ?, date= ?, time= ?, ifEatHere= ?, ifFinish= ?'
    let params = [args.shopId, args.tableId, args.cost, args.date, args.time, args.ifEatHere, args.ifFinish]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //删除订单
  async delOrder(args) {
    let sql = 'DELETE FROM orderdb WHERE orderId = ? and shopId = ? and date = ?'
    let params = [args.orderId, args.shopId, args.date]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取上一个订单
  async getLastOrder(args) {
    let sql = 'SELECT * FROM orderdb where id in(select max(id) from orderdb WHERE shopId = ? and date = ?)'
    let params = [args.shopId, args.date]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //完成订单
  async finishOrder(args) {
    let sql = 'UPDATE orderdb SET ifFinish = 1 where id = ?'
    let params = [args.id]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取完成或未完成订单
  async getOrder(args) {
    let sql = 'SELECT * FROM orderdb where ifFinish = ? and shopId = ? and date = ?'
    let params = [args.ifFinish, args.shopId, args.date] 
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取我的订单
  async getMyOrder(args) {
    let sql = 'SELECT * FROM orderdb where openId = ?'
    let params = [args.openId]
    let result = await mysqlHelper.query(sql, params)
    return result
  },
}