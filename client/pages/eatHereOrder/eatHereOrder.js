// pages/eatHereOrder/eatHereOrder.js
var period = require('../../utils/period.js')
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
    getApp().globalData.order = this.data.order
    var timeStamp = new Date().getTime().toString()
    var data = {
      bookingNo: timeStamp,  /*订单号*/
      total_fee: this.data.order.cost * 100,   /*订单金额*/
      body: "小小火锅店-" + this.data.order.period,
      openId: getApp().globalData.userInfo.openId
    }
    paymemt.getPrepayId(data, function (res) {
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
            },
            'fail': function (res) {
              console.log(res)
              console.log("支付失败")
            },
            'complete': function (res) {
              console.log("支付完成")
              wx.navigateTo({
                url: '../paySuccess/paySuccess',
              })
            }
          })
      } else if (res.status == -1) {
        util.showModel("提示", "获取支付信息失败，请重试！")
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
      shopName: '佛系青蛙暨大店'
    }
    var that = this
    var order = getApp().globalData.order
    console.log(order)
    order.shopName = getApp().globalData.shop.shopName
    period.getPeriod(order.date, order.time, function(res){
      order.period = res
      that.setData({
        order: order
      })
    })
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