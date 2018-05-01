const foodTypedb = require('../db/foodTypedb.js')
module.exports = {

  //获取菜品种类列表
  getFoodTypeList: async ctx => {
    let req = ctx.request.body
    let res = await foodTypedb.getFoodTypeList(req)
    let t = typeof (res)
    let status = t == 'object' ? 1 : -1
    ctx.body = {
      status: status,
      foodTypeList: res
    }
  },

    newFoodType: async ctx => {
    let req = ctx.request.body
    let res = await foodTypedb.newFoodType(req)
    let t = typeof (res)
    let status = t == 'object' ? 1 : -1
    ctx.body = {
      status: status,
    
      }
  }
}