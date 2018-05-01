// pages/unFinishOrder/unFinishOrder.js
var order = require('../../utils/order.js')
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index.js')
var config = require('../../config.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    getFoodList: ["打包自取", "堂食", "打包配送"],
    unfinishOrder: []
  },

  refresh: function () {
    var that = this
    var shopId = 1
    var ifFinish = 0
    var date = util.getCurrentDateYMD()
    var data = {
      shopId: shopId,
      date: date,
      ifFinish: ifFinish
    }
    wx.showLoading({
      title: '读取中，请稍后',
    })
    order.getOrder(data, function (res) {
      console.log(res)
      if (res.status == 1) {
        that.setData({
          unfinishOrder: res.order
        })
      } else if (res.status == 0) {
        util.showModel("提示", "尚无订单")
        that.setData({
          unfinishOrder: []
        })
      } else {
        util.showModel("提示", "请求出错，请重试")
      }
      wx.hideLoading()
    })
  },

  sleep: function(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  },


  finishOrder: function (e) {
    var that = this
    var id = that.data.unfinishOrder[e.currentTarget.id].id
    var data = {
      id: id
    }
    order.finishOrder(data, function(res) {
      if (res.status == 1) {
        util.showSuccess('操作成功！')
        setTimeout(function(){
          that.refresh()
        } , 500)      
      } else {
        util.showModel("提示", "请求出错，请重试")
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //this.refresh()

    var data = {
      shopId: 1,
      date: util.getCurrentDateYMD(),
      ifFinish: 0
    }

    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

    tunnel.on('connect', () => {
      console.log("WebSocket 信道已连接")
      console.log("发送数据...")
      this.tunnel.emit('speak', {
        data: data
      });
      console.log("发送完毕")
    })

    tunnel.on('reconnecting', () => {
      console.log('WebSocket 信道正在重连...')
    })

    tunnel.on('reconnect', () => {
      console.log('WebSocket 信道重连成功')
      console.log("发送数据...")
      this.tunnel.emit('speak', {
        data: data
      });
      console.log("发送完毕")
    })

    tunnel.on('error', error => {
      console.error('信道发生错误：', error)
    })

    // 监听自定义消息（服务器进行推送）
    tunnel.on('speak', speak => {
      console.log('收到消息：', speak)
      that.setData({
        unfinishOrder: speak.order
      })
    })

    // 打开信道
    tunnel.open()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.refresh()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})