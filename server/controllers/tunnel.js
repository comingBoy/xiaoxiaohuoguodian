const { tunnel } = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')
const order = require('./order.js')
const orderdb = require('../db/orderdb.js')
const orderFooddb = require('../db/orderFooddb.js')


const $broadcast = (connectedTunnelIds,type, content) => {
  tunnel.broadcast(connectedTunnelIds, type, content).then(result => {
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

const $close = (tunnelId) => {
    tunnel.closeTunnel(tunnelId)
}

function onConnect (tunnelId) {
  connectedTunnelIds.push(tunnelId)
}

function onClose (tunnelId) {
    console.log(`[onClose] =>`, { tunnelId })

    if (!(tunnelId in userMap)) {
        console.log(`[onClose][Invalid TunnelId]=>`, tunnelId)
        $close(tunnelId)
        return
    }

    const leaveUser = userMap[tunnelId]
    delete userMap[tunnelId]

    const index = connectedTunnelIds.indexOf(tunnelId)
    if (~index) {
        connectedTunnelIds.splice(index, 1)
    }
}


module.exports = {
    // 小程序请求 websocket 地址
    get: async ctx => {
        const data = await tunnel.getTunnelUrl(ctx.req)
        console.log(data)
        const tunnelInfo = data.tunnel

        userMap[tunnelInfo.tunnelId] = data.userinfo

        ctx.state.data = tunnelInfo
    },

    // 信道将信息传输过来的时候
    post: async ctx => {
      const packet = await tunnel.onTunnelMessage(ctx.request.body)
      console.log(packet)
      debug('Tunnel recive a package: %o', packet)
      switch (packet.type) {
        case 'connect':
          onConnect(packet.tunnelId)
          break
        case 'message':
          var req, req0, res, res0, status
          var order = []
          req = packet.content.messageContent.data
          userMap[packet.tunnelId] = req.shopId
          res = await orderdb.getOrder(req)
          let t = typeof (res)
          if (t == 'object') {
            status = 1
            for (var i = 0; i < res.length; i++) {
              req0 = {
                shopId: res[i].shopId,
                orderId: res[i].orderId,
                date: res[i].date
              }
              res0 = await orderFooddb.getOrderFood(req0)
              let t0 = typeof (res0)
              if (t0 == 'object') {
                order[i] = new Object()
                order[i] = res[i],
                  order[i].orderFood = res0
              } else {
                status = -1
                break
              }
            }
          } else {
            status = -1
          }
          var wsTunnelIds = []
          for (var i = 0; i < connectedTunnelIds.length; i++) {
            if (userMap[connectedTunnelIds[i]] == req.shopId) {
              wsTunnelIds.push(connectedTunnelIds[i])
            }
          }
          var wsType = 'speak'
          var wsContent = {
            status: status,
            order: order
          }
          await tunnel.broadcast(wsTunnelIds, wsType, wsContent).then(result => {
            console.log("send")
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
          break
        case 'close':
          onClose(packet.tunnelId)
          break
        default:
          break
      }
    },

}
