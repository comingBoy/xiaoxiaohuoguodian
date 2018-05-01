var mysqlHelper = require("./mysqlHelper.js")

module.exports = {

  //提交订单
  async newOrder(args) {
    let sql = 'INSERT INTO orderdb(openId, orderId, shopId, shopName, cost, date, orderStatus) VALUE(?,?,?,?,?,?,?)'
    let params = [args.openId, args.orderId, args.shopId, args.shopName, args.cost, args.date,  args.orderStatus]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取订单ID
  async getOrderId(args) { 
    let sql = 'SELECT orderId FROM orderdb where shopId= ?, cost= ?, date= ?, orderStatus= ?'
    let params = [args.shopId, args.cost, args.date, args.orderStatus]
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
    let sql = 'UPDATE orderdb SET orderStatus = 3 where id = ?'
    let params = [args.id]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取完成或未完成订单
  async getOrder(args) {
    let sql = 'SELECT * FROM orderdb where orderStatus = ? and shopId = ? and date = ?'
    let params = [args.orderStatus, args.shopId, args.date] 
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //获取未完成订单
  async getOrder0(args) {
    let sql = 'SELECT * FROM orderdb WHERE orderId = ? and shopId = ? and date = ?'
    let params = [args.orderId, args.shopId, args.date]
    let result = mysqlHelper.query(sql, params)
    return result
  },

  //获取我的订单
  async getMyOrder(args) {
    let sql = 'SELECT * FROM orderdb where openId = ?'
    let params = [args.openId]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  //改变订单状态
  async changeOrderStatus(args) {
    let sql = 'UPDATE orderdb SET orderStatus = ? where id = ?'
    let params = [args.orderStatus, args.id]
    let result = mysqlHelper.query(sql, params)
    return result
  },
}