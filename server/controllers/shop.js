const shopdb = require('../db/shopdb.js')
module.exports = {

  //获取店铺信息
  getShopInfo: async ctx => {
    let req = ctx.request.body
    let res = await shopdb.getShopInfo(req)
    let t = typeof (res)
    let status = t == 'object' ? 1 : -1
    ctx.body = {
      status: status,
      shopInfo: res
    }
  },

  //改变营业时间
  changeShopTime: async ctx => {
    let req = ctx.request.body
    let res = await shopdb.changeShopTime(req)
    let t = typeof (res)
    let status = t == 'object' ? 1 : -1
    ctx.body = {
      status: status
      }
  },

  //改变店铺状态
  changeShopStatus: async ctx => {
    let req = ctx.request.body
    let res = await shopdb.changeShopStatus(req)
    let t = typeof (res)
    let status = t == 'object' ? 1 : -1
    ctx.body = {
      status: status
    }
  }
}