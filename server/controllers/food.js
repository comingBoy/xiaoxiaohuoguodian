const foodTypedb = require('../db/foodTypedb.js')
const fooddb = require('../db/fooddb.js')
const shop = require('../db/shopdb.js')
var date = new Date()

function time_range(beginTime, endTime, nowTime) {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;
  }

  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;
  }

  var strn = nowTime.split(":");
  if (stre.length != 2) {
    return false;
  }
  var b = new Date();
  var e = new Date();
  var n = new Date();

  b.setHours(strb[0]);
  b.setMinutes(strb[1]);
  e.setHours(stre[0]);
  e.setMinutes(stre[1]);
  n.setHours(strn[0]);
  n.setMinutes(strn[1]);

  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    return true;
  } else {
    return false;
  }
}

module.exports = {

  //获取菜品列表
  getFoodList: async ctx => {
    var req, req0, res, res0, t, t0, status
    var foodList = []
    req = ctx.request.body
    var currentTime = date.getHours().toString() + ":" + date.getMinutes().toString()
    res = await shop.getShopInfo(req)
    t = typeof (res)
    if (t == 'object') {

      t = await time_range(res[0].openTime, res[0].closeTime, currentTime)
      if (t) status = 1
      else status = 0

    } else {
      status = -1
    }
    if (status == 1) {
      res = await foodTypedb.getFoodTypeList(req)
      t = typeof (res)
      if (t == 'object' && res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          res0 = await fooddb.getFoodList(res[i])
          t0 = typeof (res0)
          if (t0 == 'object') {
            foodList[i] = {
              foodTypeName: res[i].foodTypeName,
              foodTypeId: res[i].foodTypeId,
              thisTypeFoodList: res0
            }
          } else {
            status = -1
            break
          }
        }
      } else if (t == 'object' && res.length == 0) {
        status = 0
      } else {
        status = -1
      }
    }

    ctx.body = {
      status: status,
      foodList: foodList
    }
  },

  //后台获取菜品列表
  getFoodList0: async ctx => {
    var req, req0, res, res0, t, t0, status
    var foodList = []
    req = ctx.request.body
    res = await foodTypedb.getFoodTypeList(req)
    t = typeof (res)
    if (t == 'object' && res.length > 0) {
      for (var i = 0; i < res.length; i++) {
        res0 = await fooddb.getFoodList(res[i])
        t0 = typeof (res0)
        if (t0 == 'object') {
          foodList[i] = {
            foodTypeName: res[i].foodTypeName,
            foodTypeId: res[i].foodTypeId,
            thisTypeFoodList: res0
          }
        } else {
          status = -1
          break
        }
      }
    } else if (t == 'object' && res.length == 0) {
      status = 0
    } else {
      status = -1
    }

    ctx.body = {
      status: status,
      foodList: foodList
    }
  },

  //上传菜品
  newFood: async ctx => {
    let req = ctx.request.body
    let res = await fooddb.newFood(req)
    let t = typeof (res)
    var status = t == 'object' ? 1 : -1

    ctx.body = {
      status: status
    }
  },

  //起停售菜品
  changeSell: async ctx => {
    let req = ctx.request.body
    let res = await fooddb.changeSell(req)
    let t = typeof (res)
    var status = t == 'object' ? 1 : -1

    ctx.body = {
      status: status
    }
  }
}