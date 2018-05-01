// pages/analyse/analyse.js
var util = require('../../utils/util.js')
var order = require('../../utils/order.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    height: '',
    width: '',
    shopInfo: '',
    todayOrder: [],
    yesterdayOrder: [],
    todayList:{
      eatHereProfit: 0,
      eatOutProfit: 0,
      eatHereOrder: 0,
      eatOutOrder: 0,
      periodOrder: []
    },
    yesterdayList: {
      eatHereProfit: 0,
      eatOutProfit: 0,
      eatHereOrder: 0,
      eatOutOrder: 0,
      periodOrder: []
    },
    optionsList: ["当日概况","较前一日","较时段"],
    choosedIndex: 0,
    //当日概况
    todaySurvey: '',
    //较前一天
    vsYesterday: '',
    //当日不同时段
    todayPeriod: ''
  },

  refresh: function () {
    var that = this
    var chooseDate = that.data.date + ' ' + '00:00:00'
    var myDate = new Date(chooseDate);
    myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
    var year = myDate.getFullYear()
    var month = myDate.getMonth() + 1
    var day = myDate.getDate()
    year = year.toString()
    month = month < 10 ? '0' + month : month.toString()
    day = day < 10 ? '0' + day : day.toString()
    var yesterday = year + '-' + month + '-' + day
    var data = {
      date: that.data.date,
      shopId: getApp().globalData.shopInfo.shopId,
      ifFinish: 1
    }
    order.getOrder(data, function (res) {
      if (res.status == 1 || res.status == 0) {
        that.setData({
          todayOrder: res.order
        })
        data.date = yesterday
        order.getOrder(data, function (res) {
          if (res.status == 1 || res.status == 0) {
            that.setData({
              yesterdayOrder: res.order
            })
            var todayList = {
              eatHereProfit: 0,
              eatOutProfit: 0,
              eatHereOrder: 0,
              eatOutOrder: 0,
              periodOrder: []
            }
            var yesterdayList = {
              eatHereProfit: 0,
              eatOutProfit: 0,
              eatHereOrder: 0,
              eatOutOrder: 0,
              periodOrder: []
            }
            if (that.data.todayOrder.length > 0) {
              for (var i = 0; i < that.data.todayOrder.length; i++) {
                if (that.data.todayOrder[i].ifEatHere == 1) {
                  todayList.eatHereProfit += that.data.todayOrder[i].cost
                  todayList.eatHereOrder++
                } else {
                  todayList.eatOutProfit += that.data.todayOrder[i].cost
                  todayList.eatOutOrder++
                }
              }
            }
            if (that.data.yesterdayOrder.length > 0) {
              for (var j = 0; j < that.data.yesterdayOrder.length; j++) {
                if (that.data.yesterdayOrder[j].ifEatHere == 1) {
                  yesterdayList.eatHereProfit += that.data.yesterdayOrder[j].cost
                  yesterdayList.eatHereOrder++
                } else {
                  yesterdayList.eatOutProfit += that.data.yesterdayOrder[j].cost
                  yesterdayList.eatOutOrder++
                }
              }
            }
            that.setData({
              todayList: todayList,
              yesterdayList: yesterdayList
            })
            wx.hideLoading()
          } else if (res.status == -1) {
            util.showModel("提示", "获取失败，请重试！")
            wx.hideLoading()
          } else {
            util.showModel("提示", "请求失败！")
            wx.hideLoading()
          }
        })
      } else if (res.status == -1) {
        util.showModel("提示", "获取失败，请重试！")
        wx.hideLoading()
      } else {
        util.showModel("提示", "请求失败！")
        wx.hideLoading()
      }
    })

  },

  chooseDate: function (e) {
    var that = this
    that.setData({
      date: e.detail.value
    })
    wx.showLoading({
      title: '读取中，请稍后',
    })
    that.refresh()
  },

  chooseOpt: function (e) {
    this.setData({
      choosedIndex: e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
          width: res.windowWidth,
          shopInfo: getApp().globalData.shopInfo,
          date: util.getCurrentDateYMD(),
        })
      }
    })
    wx.showLoading({
      title: '读取中，请稍后',
    })
    that.refresh()
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