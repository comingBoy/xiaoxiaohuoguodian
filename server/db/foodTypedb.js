var mysqlHelper = require("./mysqlHelper.js")

module.exports = {

  //获取某店菜品种类列表
  async getFoodTypeList(args) {
    let sql = 'SELECT * FROM foodTypedb where shopId = ?'
    let params = [args.shopId]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  async newFoodType(args) {
    let sql = 'INSERT INTO foodTypedb(shopId,foodTypeName) VALUE(?,?)'
    let params = [args.shopId, args.foodTypeName]
    let result = await mysqlHelper.query(sql, params)
    return result
  },
 


  /*

  async getAllGroup(args) {
    let sql = 'SELECT * FROM groupdb'
    let params = []
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  async newGroup(args) {
    let sql = 'INSERT INTO groupdb(groupName,adminId,groupCode,groupCover) VALUE(?,?,?,?)'
    let params = [args.groupName, args.adminId, args.groupCode, args.groupCover]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  async delGroup(args) {
    let sql = 'DELETE FROM groupdb WHERE groupId = ?'
    let params = [args.groupId]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  async modifyGroup(args) {
    let sql = 'UPDATE groupdb SET groupName = ?, groupCover = ?, groupCode = ? where groupId = ?'
    let params = [args.groupName, args.groupCover, args.groupCode, args.groupId]
    let result = await mysqlHelper.query(sql, params)
    return result
  },

  */
}
