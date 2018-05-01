// pages/finishOrder/finishOrder.js
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
    finishOrder: []
  },

  refresh: function(){
    var that = this
    var date = util.getCurrentDateYMD()
    var shopId = 1
    var ifFinish = 1
    var data = {
      date: date,
      shopId: shopId,
      ifFinish: ifFinish
    }
    wx.showLoading({
      title: '读取中，请稍后',
    })
    order.getOrder(data, function (res) {
      if (res.status == 1) {
        that.setData({
          finishOrder: res.order.reverse()
        })
      } else if (res.status == 0) {
        util.showModel("提示", "尚无订单")
        that.setData({
          finishOrder: []
        })
      } else {
        util.showModel("提示", "请求出错，请重试")
      }
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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