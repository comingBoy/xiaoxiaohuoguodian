// pages/myOrder/myOrder.js
var order = require('../../utils/order.js')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getFoodList: ["打包自取", "堂食", "打包配送"],
    address: '广州市番禺区兴业大道东855号',
    order: ''
  },

  refresh: function () {
    var that = this
    //var data = getApp().globalData.userInfo.openId
    var openId = "objYV0feu9WbSIydHi5LrNlStxlw"
    var data = {
      openId: openId
    }
    wx.showLoading({
      title: '读取中，请稍后',
    })
    order.getMyOrder(data, function (res) {
      console.log(res.myOrder)
      if (res.status == 1 && res.myOrder.length >0) {
        that.setData({
          order: res.myOrder.reverse()
        })
      } else if (res.status == 1 && res.myOrder.length == 0) {
        util.showModel("提示","尚无订单")
      } else {
        util.showModel("提示", "请求出错，请重试")
      }
      wx.hideLoading()
    })
  },

  addMore: function(){
    wx.reLaunch({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refresh()
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