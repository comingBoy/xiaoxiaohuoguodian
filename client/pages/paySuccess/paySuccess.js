// pages/paySuccess/paySuccess.js
var order = require('../../utils/order.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 1,
    status: 2
  },

  getMyOrder: function () {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },

  orderMore: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var data = {
      order: getApp().globalData.order
    }
    order.newOrder(data, function (res) {
      console.log(res)
      that.setData({
        orderId: res.orderId,
        status: res.status
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