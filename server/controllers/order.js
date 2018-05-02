  const orderdb = require('../db/orderdb.js')
const orderFooddb = require('../db/orderFooddb.js')
const { tunnel } = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//监听订单是否处理
async function bindOrder(req) {
  console.log("start binding ...")
  var pending = parseInt(1000 * 60)
  await sleep(pending)
  console.log("1 min later ...")
  var req = req
  var res = await orderdb.getOrder0(req)
  if (res[0].orderStatus == 0) {
    console.log("order needed handling !")
    //message
    pending = parseInt(1000 * 60 * 4)
    await sleep(pending)
    console.log("5 min later ...")
    res = await orderdb.getOrder0(req)
    if (res[0].orderStatus == 0) {
      req.id = res[0].id
      req.orderStatus = 4
      res = await orderdb.changeOrderStatus(req)
      if (typeof (res) == 'object') {
        console.log("order successfully canceled !")
        //message
      } else {
        console.log("order failed canceled !")
        //message
      }
    }
  }
}

module.exports = {

  //提交订单
  newOrder: async ctx => {
    while (!canOrder) {
      pending = parseInt(1000 * Math.random())
      await sleep(pending)
    }
    canOrder = 0
    var req, req0, res, res0, t, t0, status, pending, orderId
    req = ctx.request.body
    res = await orderdb.getLastOrder(req.order)
    t = typeof (res)
    status = 1
    if (t == 'object' && res.length > 0) {
      req.order.orderId = res[0].orderId + 1
    } else if (t == 'object' && res.length == 0) {
      req.order.orderId = 1
    } else {
      status = -1
    }
    orderId = req.order.orderId
    if (status != -1) {
      res = await orderdb.newOrder(req.order)
      t = typeof (res)
      if (t == 'object') {
        for (var i = 0; i < req.order.orderFood.length; i++) {
          req0 = req.order.orderFood[i]
          req0.shopId = req.order.shopId
          req0.orderId = req.order.orderId
          req0.date = req.order.date
          res0 = await orderFooddb.newOrderFood(req0)
          t0 = typeof (res0)
          if (t0 != 'object') {
            res = await orderdb.delOrder(req0)
            res0 = await orderFooddb.delOrderFood(req0)
            t = typeof (res)
            t0 = typeof (res0)
            if (t == 'object' && t0 == 'object') {
              status = -1
              break
            } else {
              status = 0
              break
            }
          }
        }
      } else {
        status = -1
      }
    }

    canOrder = 1

    var status0
    var order = []
    res = await orderdb.getOrder(req.order)
    t = typeof (res)
    if (t == 'object') {
      status0 = 1
      for (var i = 0; i < res.length; i++) {
        req0 = {
          shopId: res[i].shopId,
          orderId: res[i].orderId,
          date: res[i].date
        }
        res0 = await orderFooddb.getOrderFood(req0)
        t0 = typeof (res0)
        if (t0 == 'object') {
          order[i] = new Object()
          order[i] = res[i],
          order[i].orderFood = res0
        } else {
          status0 = -1
          break
        }
      }
    } else {
      status0 = -1
    }

    var wsTunnelIds = new Array()
    for (var i = 0; i < connectedTunnelIds.length; i++) {
      if (userMap[connectedTunnelIds[i]] == req.order.shopId) {
        wsTunnelIds.push(connectedTunnelIds[i])
      }
    }
    var wsType = 'speak'
    var wsContent = {
      status: status0,
      order: order
    }

    if (wsTunnelIds.length > 0){
      await tunnel.broadcast(wsTunnelIds, wsType, wsContent).then(result => {
        const invalidTunnelIds = result.data && result.data.invalidTunnelIds || []
        if (invalidTunnelIds.length) {
          invalidTunnelIds.forEach(tunnelId => {
            delete userMap[tunnelId]
            const index = connectedTunnelIds.indexOf(tunnelId)
            if (~index) {
              connectedTunnelIds.splice(index, 1)
            }
          })
        }
      })
    }

    if (status == 1) {
      bindOrder(req.order)
    }

    ctx.body = {
      status: status,
      orderId: orderId
    }
  },

  //完成订单
  finishOrder: async ctx => {
    let req = ctx.request.body
    let res = await orderdb.finishOrder(req)
    let t = typeof (res)
    let status = t == 'object' ? 1 : -1
    
    ctx.body = {
      status: status
    }
  },

  //获取订单
  getOrder: async ctx => {
    var req, req0, res, res0, status
    var order = []
    req = ctx.request.body
    res = await orderdb.getOrder(req)
    let t = typeof(res)
    if(t == 'object' && res.length >0){
      status = 1
      for(var i = 0; i < res.length;i++){
        req0={
        shopId : res[i].shopId,
        orderId : res[i].orderId,
        date : res[i].date
        }
        res0 = await orderFooddb.getOrderFood(req0)
        let t0=typeof(res0)
        if(t0 == 'object'){
          order[i] = new Object()
          order[i] = res[i],
          order[i].orderFood = res0
        }else{
          status = -1
          break
        }
      }
    } else if (t == 'object' && res.length == 0) {
      status = 0
    } else{
      status = -1
    }
 
    ctx.body = {
      status: status,
      order: order
    }
  },

  //获取我的订单
  getMyOrder: async ctx => {
    var req, req0, res, res0, t, t0, status
    var myOrder = new Array()
    req = ctx.request.body
    res = await orderdb.getMyOrder(req)
    t = typeof (res)
    if (t == 'object' && res.length > 0) {
      status = 1
      for (var i = 0; i < res.length; i++) {
        myOrder[i] = new Object()
        myOrder[i]=res[i]
        res0 = await orderFooddb.getOrderFood(res[i])
        t0 = typeof (res0)
        if (t0 == 'object') {
          myOrder[i].orderFood = new Array()
          myOrder[i].orderFood = res0
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
      myOrder: myOrder
    }
  },
}