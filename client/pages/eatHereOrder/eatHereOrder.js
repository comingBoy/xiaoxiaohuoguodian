// pages/eatHereOrder/eatHereOrder.js
var period = require('../../utils/period.js')
var payment = require('../../utils/paymemt.js')
var util = require('../../utils/util.js')
var order = require('../../utils/order.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getFoodList: ["打包自取", "堂食", "打包配送"],
    address: '广州市番禺区兴业大道东855号',
    order: ''
  },

  modifyOrder: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  submit: function () {
    var that = this
    var order0 = this.data.order
    order0.orderStatus = 0
    var data = {
      order: order0
    }
    
    order.newOrder(data, function (res) {
      console.log(res)
      if (res.status == 1) {
        order0.orderId = res.orderId
        that.setData({
          order: order0,
        })
        var timeStamp = new Date().getTime().toString()
        var data = {
          bookingNo: timeStamp,  /*订单号*/
          total_fee: order0.cost * 100,   /*订单金额*/
          body: "小小火锅店-火锅消费",
          openId: getApp().globalData.userInfo.openId
        }
        payment.getPrepayId(data, function (res) {
          if (res.status == 1) {
            wx.requestPayment(
              {
                'timeStamp': res.timeStamp,
                'nonceStr': res.nonceStr,
                'package': res.package,
                'signType': 'MD5',
                'paySign': res.paySign,
                'success': function (res) {
                  console.log("支付成功")
                  order.orderStatus = 1
                  getApp().globalData.order = order0
                  wx.navigateTo({
                    url: '../paySuccess/paySuccess',
                  })
                },
                'fail': function (res) {
                  console.log("支付失败")
                  order.status = -1
                  getApp().globalData.order = order0
                },
                'complete': function (res) {
                  console.log("支付完成")

                }
              })
          } else if (res.status == -1) {
            util.showModel("提示", "获取支付信息失败，请重试！")
          } else {
            util.showModel("提示", "请求出错！")
          }
        })
      } else if (res.status == -1) {
        util.showModel("提示","创建订单失败，请重试！")
      } else if (res.status == 0) {
        util.showModel("提示", "数据异常！")
      } else {
        util.showModel("提示", "请求出错！")
      }
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getApp().globalData.shop = {
      shopName: '小小火锅店'
    }
    var that = this
    var order = getApp().globalData.order
    order.shopName = getApp().globalData.shop.shopName
    that.setData({
      order: order
    })
    /*
    period.getPeriod(order.date, order.time, function(res){
      order.period = res
      that.setData({
        order: order
      })
    })*/
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