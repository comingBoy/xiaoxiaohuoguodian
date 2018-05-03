// pages/eatHereOrder/eatHereOrder.js
var period = require('../../utils/period.js')
var payment = require('../../utils/paymemt.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkDeclare: false,
    ifHiddenOrder: true,
    ifHiddenFill: false,
    getFoodList: ["打包自取", "堂食", "打包配送"],
    address: '广州市番禺区兴业大道东855号',
    order: '',
    declareContent: [

    ],
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
              wx.navigateTo({
                url: '../paySuccess/paySuccess',
              })
            },
            'fail': function (res) {
              console.log(res)
              console.log("支付失败")
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.declareContent.length == 0) {
      this.setData({
        checkDeclare: true
      })
    } else {
      checkDeclare: false
    }
    getApp().globalData.shop = {
      shopName: '小小火锅店'
    }
    var that = this
    var order = getApp().globalData.order
    console.log(order)
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

  },
  checkDeclare: function (e) {
    var src = e.currentTarget.dataset.src
    src = !src
    this.setData({
      checkDeclare: src
    })
  },
  /**
   * 输入地址
   */
  inputMyAddress: function (e) {
    console.log(e)
    var order = this.data.order
    order.address = e.detail.value
    this.setData({
      order
    })
  },
  /**
   * 输入电话
   */
  inputMyPhone: function (e) {
    console.log(e)
    var order = this.data.order
    order.phone = e.detail.value
    this.setData({
      order
    })
  },
  /**
   * 确认信息
   */
  comfirmInfo: function (e) {
    var checkDeclare = this.data.checkDeclare
    var order = this.data.order
    if ((checkDeclare && (order.phone != "") && (order.address != ""))) {
      console.log('跳转到订单支付')
      wx.setStorage({
        key: 'myAddress',
        data: order.address,
      })
      wx.setStorage({
        key: 'myPhone',
        data: order.phone,
      })
      this.setData({
        ifHiddenOrder: false,
        ifHiddenFill: true,
      })
    }
  },
  /**
   * 修改地址电话
   */
  modify: function () {
    this.setData({
      ifHiddenOrder: true,
      ifHiddenFill: false,
    })
  }
})