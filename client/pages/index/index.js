//index.js
var food = require('../../utils/food.js')
var foodType = require('../../utils/foodType.js')
var util = require('../../utils/util.js')
var shop = require('../../utils/shop.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDate: ['美国', '中国', '巴西', '日本'],
    orderDateIndex: 0,
    userInfo: {},
    logged: false,
    ifHiddenMenu: true,
    menuAnimation: {},
    menuBackAnimation: {},
    code: [1, 3, 1, 4, 5, 2],
    codeIndex: 0,
    shopInfo: '',
    ifEatHere: '',
    shopStatus: ["已关店", "营业中"],
    chooseFoodInfo: null,
    foodListIndex: null,
    foodIndex: null,
    chooseProperty: true,
    previewImage: true,
    previewImageSrc: "../../images/xiaomian.jpg",
    modifyProperty: true,
    hiddenShoppingCartDetail: true,
    imagesList: [],
    tableNum: 1,
    classChooseId: 0,
    orderType: ["打包", "堂食"],
    foodList: [],
    shoppingCart: [],
    shoppingCartNum: 0,
    allPrice: 0,
    allNum: 0,
    orderFood: null,
    finishChooseProperty: false,
    finishModifyProperty: true,
    ifToBackGround: false,
  },

  getWeekArray: function () {
    var orderDate = []
    for (var i = 0; i < 7; i++) {
      var myDate = new Date();
      myDate.setDate(myDate.getDate() + i);
      var s1 = (myDate.getMonth() + 1) + "月" + (myDate.getDate() + 1) + "日"
      orderDate.push(s1)
    }
    this.setData({
      orderDate
    })
  },

  shopManage: function () {
    wx.reLaunch({
      url: '../unFinishOrder/unFinishOrder',
    })
  },


  // 用户登录示例
  login: function () {
    if (this.data.logged) return
    var that = this

    // 调用登录接口
    qcloud.login({
      success(result) {
        if (result) {
          getApp().globalData.userInfo = result
          getApp().globalData.logged = true
          that.setData({
            userInfo: result,
            logged: true
          })
          wx.setStorage({
            key: "userInfo",
            data: result
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              getApp().globalData.userInfo = result.data.data
              getApp().globalData.logged = true
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
              wx.setStorage({
                key: "userInfo",
                data: result.data.data
              })
            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
      }
    })
  },
  refresh: function (e) {
    var that = this
    var data = {
      shopId: e
    }
    food.getFoodList(data, function (res) {
      var foodList = res.foodList
      for (var i = 0; i < foodList.length; i++) {
        for (var j = 0; j < foodList[i].thisTypeFoodList.length; j++) {
          foodList[i].thisTypeFoodList[j].hasProperty = false
          if (foodList[i].thisTypeFoodList[j].priceProperty != null && foodList[i].thisTypeFoodList[j].priceProperty != "") {
            foodList[i].thisTypeFoodList[j].hasProperty = true
            var str = foodList[i].thisTypeFoodList[j].priceProperty
            foodList[i].thisTypeFoodList[j].priceProperty = new Array()
            foodList[i].thisTypeFoodList[j].priceProperty = that.getProperty(str)
          } else {
            foodList[i].thisTypeFoodList[j].priceProperty = []
          }
          if (foodList[i].thisTypeFoodList[j].singleProperty != null && foodList[i].thisTypeFoodList[j].singleProperty != "") {
            foodList[i].thisTypeFoodList[j].hasProperty = true
            var str = foodList[i].thisTypeFoodList[j].singleProperty
            foodList[i].thisTypeFoodList[j].singleProperty = new Array()
            foodList[i].thisTypeFoodList[j].singleProperty = that.getProperty(str)
          } else {
            foodList[i].thisTypeFoodList[j].singleProperty = []
          }
          if (foodList[i].thisTypeFoodList[j].multiProperty != null && foodList[i].thisTypeFoodList[j].multiProperty != "") {
            foodList[i].thisTypeFoodList[j].hasProperty = true
            var str = foodList[i].thisTypeFoodList[j].multiProperty
            foodList[i].thisTypeFoodList[j].multiProperty = new Array()
            foodList[i].thisTypeFoodList[j].multiProperty = that.getProperty(str)
            for (var k = 0; k < foodList[i].thisTypeFoodList[j].multiProperty.length; k++) {
              foodList[i].thisTypeFoodList[j].multiProperty[k].required = false
            }
          } else {
            foodList[i].thisTypeFoodList[j].multiProperty = []
          }
        }
      }

      for (var i = 0; i < foodList.length; i++) {
        foodList[i]['className'] = foodList[i]['foodTypeName']
        foodList[i]['classID'] = 'class' + foodList[i]['foodTypeId']
        foodList[i]['list'] = foodList[i]['thisTypeFoodList']
        delete foodList[i]['foodTypeName']
        delete foodList[i]['thisTypeFoodList']
        for (var j = 0; j < foodList[i].list.length; j++) {
          foodList[i].list[j].orderList = new Array()
          foodList[i].list[j]['name'] = foodList[i].list[j]['foodName']
          foodList[i].list[j]['photo'] = foodList[i].list[j]['foodPhoto']
          foodList[i].list[j]['sellOut'] = foodList[i].list[j]['ifSoldOut']
          foodList[i].list[j]['sellOut'] = foodList[i].list[j]['sellOut'] == 1 ? true : false
          foodList[i].list[j]['mulProperty'] = foodList[i].list[j]['multiProperty']
          delete foodList[i].list[j]['foodName']
          delete foodList[i].list[j]['foodPhoto']
          delete foodList[i].list[j]['ifSoldOut']
          delete foodList[i].list[j]['multiProperty']
        }
      }
      that.setData({
        foodList: foodList
      })
      wx.hideLoading()
    })
  },

  //将属性转换为对象
  getProperty: function (e) {
    var property = new Array()
    var index = 0, len = -1, num = -1, price
    for (var i = 0; i < e.length; i++) {
      if (e[i] == ":") {
        num = -1
        len++
        property[len] = new Object()
        property[len].propertyList = new Array()
        property[len].propertyName = e.substring(index, i)
        property[len].required = true,
          property[len].beChoosed = false
        property[len].isMul = false
        index = i + 1
      }
      if (e[i] == "(") {
        num++
        property[len].propertyList[num] = new Object()
        property[len].propertyList[num].name = e.substring(index, i)
        property[len].propertyList[num].beChoosed = false
        index = i + 1
      }
      if (e[i] == ")") {
        property[len].propertyList[num].price = parseFloat(e.substring(index, i))
        index = i + 1
      }
      if (e[i] == "," && e[i - 1] != ")") {
        num++
        property[len].propertyList[num] = new Object()
        property[len].propertyList[num].name = e.substring(index, i)
        property[len].propertyList[num].beChoosed = false
        index = i + 1
      } else if (e[i] == "," && e[i - 1] == ")") {
        index = i + 1
      }
      if (e[i] == ";" && e[i - 1] != ")") {
        num++
        property[len].propertyList[num] = new Object()
        property[len].propertyList[num].name = e.substring(index, i)
        property[len].propertyList[num].beChoosed = false
        index = i + 1
      } else if (e[i] == ";" && e[i - 1] == ")") {
        index = i + 1
      }
    }
    return property
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeekArray()
    try {
      var value = wx.getStorageSync('userInfo')
      if (value) {
        console.log("获取用户信息成功")
        // Do something with return value
        getApp().globalData.userInfo = value
        getApp().globalData.logged = true
        this.setData({
          userInfo: value,
          logged: true
        })
      } else {
        console.log("无用户信息")
        this.login()
      }
    } catch (e) {
      // Do something when catch error
    }
    var that = this
    this.setData({
      ifEatHere: getApp().globalData.ifEatHere
    })
    var shopId = 1
    wx.showLoading({
      title: '读取中，请稍后',
    })
    var data = {
      shopId: shopId
    }
    shop.getShopInfo(data, function (res) {
      console.log(res)
      if (res.status == 1) {
        getApp().globalData.shopInfo = res.shopInfo[0]
        that.setData({
          shopInfo: res.shopInfo[0]
        })
      } else if (res.status == -1) {
        util.showModel("提示", "获取店铺信息失败，请重试！")
      } else {
        util.showModel("提示", "请求失败！")
      }
    })
    this.refresh(shopId)
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
  /**
   * 选择类别
   */
  chooseClass: function (e) {
    var toClass = e.currentTarget.dataset.class
    var code = this.data.code
    var codeIndex = this.data.codeIndex
    var index = parseInt(e.currentTarget.id) + 1
    console.log(code[codeIndex], index)
    if (code[codeIndex] == index) {
      codeIndex++
      this.setData({
        codeIndex
      })
      if (codeIndex == 6) {
        console.log("密码正确")
        this.setData({
          ifToBackGround: true
        })
      }
    } else {
      this.setData({
        codeIndex: 0,
        ifToBackGround: false,
      })
    }

    this.setData({
      classChooseId: e.currentTarget.id,
      toClass: toClass
    })
  },
  /**
   * 预览图片
   */
  previewImage: function (e) {
    var status = e.currentTarget.dataset.status
    var that = this


    if (status == 'open') {

      //第1步：创建动画实例
      var animation = wx.createAnimation({
        duration: 50,
        transformOrigin: '50% 100% 0'
      })

      //第2步：这个动画实例赋给当前动画实例
      this.animation = animation

      //第3步：执行第一组动画
      animation.opacity(0).step();

      // 第4步：导出动画对象赋给数据对象储存 
      this.setData({
        animationData: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画 
      setTimeout(function () {
        that.setData({
          previewImage: false,
          previewImageSrc: e.currentTarget.dataset.src
        })
        // 执行第二组动画 
        animation.opacity(1).step({ duration: 300 });
        // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
        this.setData({
          animationData: animation
        })
      }.bind(this), 50)
    }
    if (status == 'close') {
      //第1步：创建动画实例
      var animation = wx.createAnimation({
        duration: 300,
        transformOrigin: '50% 100% 0'
      })

      //第2步：这个动画实例赋给当前动画实例
      this.animation = animation

      //第3步：执行第一组动画
      animation.opacity(0).step();

      // 第4步：导出动画对象赋给数据对象储存 
      this.setData({
        animationData: animation.export()
      })

      // 第5步：设置定时器到指定时候后，执行第二组动画 
      setTimeout(function () {
        that.setData({
          previewImage: true,
        })
      }.bind(this), 500)
    }
  },
  /**
   * 打开选择商品属性窗口
   */
  chooseProperty: function (e) {
    console.log(111)
    var status = e.currentTarget.dataset.status
    var chooseFoodInfo
    if (status == 'open') {
      var foodListIndex = e.currentTarget.dataset.foodlistindex
      var foodIndex = e.currentTarget.dataset.foodindex
      chooseFoodInfo = this.data.foodList[foodListIndex].list[foodIndex]
      //如果没有属性选项不会弹窗
      if (chooseFoodInfo.hasProperty) {
        this.setData({
          chooseFoodInfo: chooseFoodInfo,
          foodListIndex: foodListIndex,
          foodIndex: foodIndex,
        })
      } else {
        return
      }
    }

    //第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 200,
      transformOrigin: '50% 100% 0'
    })

    //第2步：这个动画实例赋给当前动画实例
    this.animation = animation

    //第3步：执行第一组动画
    animation.opacity(0).scaleY(0).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).scaleY(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
    }.bind(this), 200)

    if (status == 'open') {
      this.setData({
        chooseProperty: false
      })
    }
    if (status == 'close') {
      this.setData({
        chooseProperty: true,
        finishChooseProperty: false,
      })
    }
  },
  /**
   * 选择商品属性
   */
  choosePro: function (e) {
    var src = e.currentTarget.dataset.src
    var propertyindex = e.currentTarget.dataset.propertyindex
    var index = e.currentTarget.dataset.index
    var chooseFoodInfo = this.data.chooseFoodInfo
    var finishChooseProperty = this.data.finishChooseProperty
    if (src == 'single') {
      chooseFoodInfo.singleProperty[propertyindex].beChoosed = true
      for (var i = 0; i < chooseFoodInfo.singleProperty[propertyindex].propertyList.length; i++) {
        if (i == index) {
          chooseFoodInfo.singleProperty[propertyindex].propertyList[i].beChoosed = true
        } else {
          chooseFoodInfo.singleProperty[propertyindex].propertyList[i].beChoosed = false
        }
      }
    } else if (src == 'mul') {
      chooseFoodInfo.mulProperty[propertyindex].propertyList[index].beChoosed = !chooseFoodInfo.mulProperty[propertyindex].propertyList[index].beChoosed
      for (var i; i < chooseFoodInfo.mulProperty[propertyindex].propertyList.length; i++) {
        if (chooseFoodInfo.mulProperty[propertyindex].propertyList[i].beChoosed == true) {
          chooseFoodInfo.mulProperty[propertyindex].beChoosed = true
          break;
        } else {
          chooseFoodInfo.mulProperty[propertyindex].beChoosed = false
        }
      }
    } else if (src == 'price') {
      chooseFoodInfo.priceProperty[propertyindex].beChoosed = true
      for (var i = 0; i < chooseFoodInfo.priceProperty[propertyindex].propertyList.length; i++) {
        if (i == index) {
          chooseFoodInfo.priceProperty[propertyindex].propertyList[i].beChoosed = true
        } else {
          chooseFoodInfo.priceProperty[propertyindex].propertyList[i].beChoosed = false
        }
      }
      chooseFoodInfo.price = chooseFoodInfo.priceProperty[propertyindex].propertyList[index].price
    }
    for (var i = 0; i < chooseFoodInfo.priceProperty.length; i++) {
      if (chooseFoodInfo.priceProperty[i].required == false) {
        continue
      } else {
        if (chooseFoodInfo.priceProperty[i].beChoosed == false) {
          finishChooseProperty = false
          break
        } else {
          finishChooseProperty = true
        }
      }
    }
    if (finishChooseProperty == true) {
      for (var i = 0; i < chooseFoodInfo.singleProperty.length; i++) {
        if (chooseFoodInfo.singleProperty[i].required == false) {
          continue
        } else {
          if (chooseFoodInfo.singleProperty[i].beChoosed == false) {
            finishChooseProperty = false
            break
          } else {
            finishChooseProperty = true
          }
        }
      }
    }
    if (finishChooseProperty == true) {
      for (var i = 0; i < chooseFoodInfo.mulProperty.length; i++) {
        if (chooseFoodInfo.mulProperty[i].required == false) {
          continue
        } else {
          if (chooseFoodInfo.mulProperty[i].beChoosed == false) {
            finishChooseProperty = false
            break
          } else {
            finishChooseProperty = true
          }
        }
      }
    }

    this.setData({
      chooseFoodInfo: chooseFoodInfo,
      finishChooseProperty: finishChooseProperty
    })
  },
  /**
   * 将选择好的商品加入购物车
   */
  addToShoppingCart: function (e) {
    var allNum = this.data.allNum
    allNum++
    var finishChooseProperty = this.data.finishChooseProperty
    if (!finishChooseProperty) return
    var shoppingCart = this.data.shoppingCart
    var foodList = this.data.foodList
    var orderID = shoppingCart.length
    var chooseFoodInfo = this.data.chooseFoodInfo
    var foodListIndex = this.data.foodListIndex
    var foodIndex = this.data.foodIndex
    var allPrice = this.data.allPrice
    allPrice += chooseFoodInfo.price
    var foodOrder = {
      orderID: orderID,
      foodName: chooseFoodInfo.name,
      num: 1,
      priceProperty: [],
      singleProperty: [],
      mulProperty: [],
      propertyString: "",
      price: chooseFoodInfo.price,
      pricePropertyString: "",
      foodIndex: foodIndex,
      foodListIndex: foodListIndex,
      orderListIndex: 0,
      foodId: chooseFoodInfo.foodId,
    }
    for (var i = 0; i < chooseFoodInfo.priceProperty.length; i++) {
      for (var j = 0; j < chooseFoodInfo.priceProperty[i].propertyList.length; j++) {
        if (chooseFoodInfo.priceProperty[i].propertyList[j].beChoosed == true) {
          foodOrder.priceProperty.push(chooseFoodInfo.priceProperty[i].propertyList[j].name)
        }
      }
    }
    for (var i = 0; i < chooseFoodInfo.singleProperty.length; i++) {
      for (var j = 0; j < chooseFoodInfo.singleProperty[i].propertyList.length; j++) {
        if (chooseFoodInfo.singleProperty[i].propertyList[j].beChoosed == true) {
          foodOrder.singleProperty.push(chooseFoodInfo.singleProperty[i].propertyList[j].name)
        }
      }
    }
    for (var i = 0; i < chooseFoodInfo.mulProperty.length; i++) {
      for (var j = 0; j < chooseFoodInfo.mulProperty[i].propertyList.length; j++) {
        if (chooseFoodInfo.mulProperty[i].propertyList[j].beChoosed == true) {
          foodOrder.mulProperty.push(chooseFoodInfo.mulProperty[i].propertyList[j].name)
        }
      }
    }
    //遍历查找是否有相同属性的商品在购物车中,有的话把Num加1，并且跳出函数
    for (var item of foodList[foodListIndex].list[foodIndex].orderList) {
      foodOrder.orderID = item.orderID
      foodOrder.num = item.num
      foodOrder.propertyString = item.propertyString
      foodOrder.pricePropertyString = item.pricePropertyString
      foodOrder.orderListIndex = item.orderListIndex
      if (JSON.stringify(item) == JSON.stringify(foodOrder)) {
        item.num++
        shoppingCart[item.orderID].num++
        this.setData({
          foodList: foodList,
          shoppingCart: shoppingCart,
          chooseProperty: true,
          finishChooseProperty: false,
          allNum: allNum,
          allPrice: allPrice,
        })
        console.log(shoppingCart)
        return
      }
    }
    //购物车中没有时的操作
    foodOrder.orderID = shoppingCart.length
    var shoppingCartNum = this.data.shoppingCartNum
    shoppingCartNum++
    if (foodOrder.singleProperty.length != 0) {
      foodOrder.propertyString = foodOrder.singleProperty.join(",")
      if (foodOrder.mulProperty.length != 0)
        foodOrder.propertyString = foodOrder.propertyString + "," + foodOrder.mulProperty.join(",")
    } else if (foodOrder.mulProperty.length != 0) {
      foodOrder.propertyString = foodOrder.mulProperty.join(",")
    }
    if (foodOrder.priceProperty.length != 0) {
      foodOrder.pricePropertyString = foodOrder.priceProperty.join(",")
    }
    foodOrder.num = 1
    foodOrder.orderListIndex = foodList[foodListIndex].list[foodIndex].orderList.length
    foodList[foodListIndex].list[foodIndex].orderList.push(foodOrder)
    shoppingCart.push(foodOrder)
    this.setData({
      foodList: foodList,
      shoppingCart: shoppingCart,
      chooseProperty: true,
      finishChooseProperty: false,
      allNum: allNum,
      allPrice: allPrice,
      shoppingCartNum: shoppingCartNum
    })
  },
  /**
   * 修改购物车中商品的数量
   */
  modifyFoodNum: function (e) {
    console.log(e)
    var srcFrom = e.currentTarget.dataset.from
    var foodIndex
    var foodListIndex
    var src
    var allNum
    var allPrice
    var foodList
    var shoppingCart
    var shoppingCartNum
    var orderIndex
    if (srcFrom == "foodList") {
      orderIndex = e.currentTarget.dataset.orderindex
      foodIndex = e.currentTarget.dataset.foodindex
      foodListIndex = e.currentTarget.dataset.foodlistindex
      src = e.currentTarget.dataset.src
      allNum = this.data.allNum
      allPrice = this.data.allPrice
      foodList = this.data.foodList
      shoppingCart = this.data.shoppingCart
      shoppingCartNum = this.data.shoppingCartNum
    } else {
      var index = e.currentTarget.dataset.index
      shoppingCart = this.data.shoppingCart
      src = e.currentTarget.dataset.src
      foodIndex = shoppingCart[index].foodIndex
      foodListIndex = shoppingCart[index].foodListIndex
      allNum = this.data.allNum
      allPrice = this.data.allPrice
      foodList = this.data.foodList
      shoppingCartNum = this.data.shoppingCartNum
      orderIndex = shoppingCart[index].orderListIndex
    }

    if (foodList[foodListIndex].list[foodIndex].hasProperty == false) {
      if (foodList[foodListIndex].list[foodIndex].orderList.length == 0) {
        var order = {
          orderID: shoppingCart.length,
          foodName: foodList[foodListIndex].list[foodIndex].name,
          foodId: foodList[foodListIndex].list[foodIndex].foodId,
          num: 1,
          priceProperty: [],
          singleProperty: [],
          mulProperty: [],
          propertyString: "",
          pricePropertyString: "",
          price: foodList[foodListIndex].list[foodIndex].price,
          foodIndex: foodIndex,
          foodListIndex: foodListIndex,
          orderListIndex: orderIndex,
        }
        allNum++
        shoppingCartNum++
        allPrice = allPrice + foodList[foodListIndex].list[foodIndex].price
        foodList[foodListIndex].list[foodIndex].orderList.push(order)
        shoppingCart.push(order)
      } else {
        if (src == 'add') {
          foodList[foodListIndex].list[foodIndex].orderList[0].num++
          var orderID = foodList[foodListIndex].list[foodIndex].orderList[0].orderID
          shoppingCart[orderID].num++
          if (shoppingCart[orderID].num == 1) {
            shoppingCartNum++
          }
          allNum++
          allPrice = allPrice + foodList[foodListIndex].list[foodIndex].orderList[0].price
        } else if (src == 'del') {
          if (foodList[foodListIndex].list[foodIndex].orderList[0].num == 0) return
          foodList[foodListIndex].list[foodIndex].orderList[0].num--
          var orderID = foodList[foodListIndex].list[foodIndex].orderList[0].orderID
          shoppingCart[orderID].num--
          if (shoppingCart[orderID].num == 0) {
            shoppingCartNum--
            //等于0时隐藏购物车详情
            if (shoppingCartNum == 0) {
              this.setData({
                hiddenShoppingCartDetail: true
              })
            }
          }
          allNum--
          allPrice = allPrice - foodList[foodListIndex].list[foodIndex].orderList[0].price
        }
      }

      this.setData({
        foodList: foodList,
        shoppingCart: shoppingCart,
        shoppingCartNum: shoppingCartNum,
        allNum: allNum,
        allPrice: allPrice,
      })
    } else {
      var orderID = foodList[foodListIndex].list[foodIndex].orderList[orderIndex].orderID
      if (src == 'del') {
        if (foodList[foodListIndex].list[foodIndex].orderList[orderIndex].num == 0) return
        foodList[foodListIndex].list[foodIndex].orderList[orderIndex].num--
        shoppingCart[orderID].num--
        allNum--
        allPrice -= shoppingCart[orderID].price
        if (shoppingCart[orderID].num == 0) {
          shoppingCartNum--
          //等于0时隐藏购物车详情
          if (shoppingCartNum == 0) {
            this.setData({
              hiddenShoppingCartDetail: true
            })
          }
        }
        this.setData({
          foodList: foodList,
          shoppingCart: shoppingCart,
          shoppingCartNum: shoppingCartNum,
          allNum: allNum,
          allPrice: allPrice,
        })
      } else if (src == 'add') {
        foodList[foodListIndex].list[foodIndex].orderList[orderIndex].num++
        shoppingCart[orderID].num++
        if (shoppingCart[orderID].num == 1) {
          shoppingCartNum++
        }
        allNum++
        allPrice += shoppingCart[orderID].price
        this.setData({
          foodList: foodList,
          shoppingCart: shoppingCart,
          shoppingCartNum: shoppingCartNum,
          allNum: allNum,
          allPrice: allPrice,
        })
      }
    }
  },
  /**
   * 打开修改购物车中的属性的窗口
   */
  modifyProperty: function (e) {
    var status = e.currentTarget.dataset.status
    var chooseFoodInfo
    var chooseOrder
    if (status == 'open') {
      var foodListIndex = e.currentTarget.dataset.foodlistindex
      var foodIndex = e.currentTarget.dataset.foodindex
      var orderIndex = e.currentTarget.dataset.orderindex
      chooseFoodInfo = this.data.foodList[foodListIndex].list[foodIndex]
      this.setData({
        chooseFoodInfo: chooseFoodInfo
      })
      chooseOrder = chooseFoodInfo.orderList[orderIndex]
      console.log(chooseOrder)

      chooseFoodInfo = this.data.chooseFoodInfo
      chooseFoodInfo.pricePropertyString = ''
      chooseFoodInfo.foodListIndex = foodListIndex
      chooseFoodInfo.foodIndex = foodIndex
      chooseFoodInfo.orderIndex = orderIndex
      chooseFoodInfo.orderID = chooseOrder.orderID
      console.log(chooseFoodInfo)
      chooseFoodInfo.pricePropertyString = chooseOrder.priceProperty.join(',')
      for (var propertyList of chooseFoodInfo.priceProperty) {
        for (var property of propertyList.propertyList) {
          if (chooseFoodInfo.pricePropertyString.indexOf(property.name) != -1) {
            property.beChoosed = true
            chooseFoodInfo.price = property.price
          }
        }
      }
      for (var propertyList of chooseFoodInfo.singleProperty) {
        for (var property of propertyList.propertyList) {
          if (chooseOrder.propertyString.indexOf(property.name) != -1) {
            property.beChoosed = true
          }
        }
      }
      for (var propertyList of chooseFoodInfo.mulProperty) {
        for (var property of propertyList.propertyList) {
          if (chooseOrder.propertyString.indexOf(property.name) != -1) {
            property.beChoosed = true
          }
        }
      }
      //如果没有属性选项不会弹窗
      if (chooseFoodInfo.hasProperty) {
        this.setData({
          chooseFoodInfo: chooseFoodInfo,
          foodListIndex: foodListIndex,
          foodIndex: foodIndex,
        })
      } else {
        return
      }
    }

    //第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 200,
      transformOrigin: '50% 100% 0'
    })

    //第2步：这个动画实例赋给当前动画实例
    this.animation = animation

    //第3步：执行第一组动画
    animation.opacity(0).scaleY(0).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).scaleY(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
    }.bind(this), 200)

    if (status == 'open') {
      this.setData({
        modifyProperty: false
      })
    }
    if (status == 'close') {
      this.setData({
        modifyProperty: true,
        finishModifyProperty: true,
      })
    }
  },
  /**
   * 修改商品属性
   */
  modifyPro: function (e) {
    var src = e.currentTarget.dataset.src
    var propertyindex = e.currentTarget.dataset.propertyindex
    var index = e.currentTarget.dataset.index
    var chooseFoodInfo = this.data.chooseFoodInfo
    var finishModifyProperty = this.data.finishModifyProperty
    if (src == 'single') {
      chooseFoodInfo.singleProperty[propertyindex].beChoosed = true
      for (var i = 0; i < chooseFoodInfo.singleProperty[propertyindex].propertyList.length; i++) {
        if (i == index) {
          chooseFoodInfo.singleProperty[propertyindex].propertyList[i].beChoosed = true
        } else {
          chooseFoodInfo.singleProperty[propertyindex].propertyList[i].beChoosed = false
        }
      }
    } else if (src == 'mul') {
      chooseFoodInfo.mulProperty[propertyindex].propertyList[index].beChoosed = !chooseFoodInfo.mulProperty[propertyindex].propertyList[index].beChoosed
      for (var i; i < chooseFoodInfo.mulProperty[propertyindex].propertyList.length; i++) {
        if (chooseFoodInfo.mulProperty[propertyindex].propertyList[i].beChoosed == true) {
          chooseFoodInfo.mulProperty[propertyindex].beChoosed = true
          break;
        } else {
          chooseFoodInfo.mulProperty[propertyindex].beChoosed = false
        }
      }
    }
    this.setData({
      chooseFoodInfo: chooseFoodInfo,
      finishModifyProperty: finishModifyProperty
    })
  },
  /**
   * 确认修改商品属性
   */
  confirmModifyPro: function (e) {
    var chooseFoodInfo = this.data.chooseFoodInfo
    var foodListIndex = chooseFoodInfo.foodListIndex
    var foodIndex = chooseFoodInfo.foodIndex
    var orderIndex = chooseFoodInfo.orderIndex
    var orderID = chooseFoodInfo.orderID
    var foodList = this.data.foodList
    var shoppingCart = this.data.shoppingCart
    foodList[foodListIndex].list[foodIndex].orderList[orderIndex].propertyString = ""
    foodList[foodListIndex].list[foodIndex].orderList[orderIndex].singleProperty = []
    foodList[foodListIndex].list[foodIndex].orderList[orderIndex].mulProperty = []
    shoppingCart[orderID].singleProperty = []
    shoppingCart[orderID].mulProperty = []
    shoppingCart[orderID].propertyString = ""
    for (var i = 0; i < chooseFoodInfo.singleProperty.length; i++) {
      for (var j = 0; j < chooseFoodInfo.singleProperty[i].propertyList.length; j++) {
        if (chooseFoodInfo.singleProperty[i].propertyList[j].beChoosed == true) {
          foodList[foodListIndex].list[foodIndex].orderList[orderIndex].singleProperty.push(chooseFoodInfo.singleProperty[i].propertyList[j].name)
          shoppingCart[orderID].singleProperty.push(chooseFoodInfo.singleProperty[i].propertyList[j].name)
        }
      }
    }
    for (var i = 0; i < chooseFoodInfo.mulProperty.length; i++) {
      for (var j = 0; j < chooseFoodInfo.mulProperty[i].propertyList.length; j++) {
        if (chooseFoodInfo.mulProperty[i].propertyList[j].beChoosed == true) {
          foodList[foodListIndex].list[foodIndex].orderList[orderIndex].mulProperty.push(chooseFoodInfo.mulProperty[i].propertyList[j].name)
          shoppingCart[orderID].mulProperty.push(chooseFoodInfo.mulProperty[i].propertyList[j].name)
        }
      }
    }
    if (shoppingCart[orderID].singleProperty.length != 0) {
      shoppingCart[orderID].propertyString = shoppingCart[orderID].singleProperty.join(",")
      if (shoppingCart[orderID].mulProperty.length != 0)
        shoppingCart[orderID].propertyString = shoppingCart[orderID].propertyString + "," + shoppingCart[orderID].mulProperty.join(",")
    } else if (shoppingCart[orderID].mulProperty.length != 0) {
      shoppingCart[orderID].propertyString = shoppingCart[orderID].mulProperty.join(",")
    }
    foodList[foodListIndex].list[foodIndex].orderList[orderIndex].propertyString = shoppingCart[orderID].propertyString
    this.setData({
      foodList: foodList,
      shoppingCart: shoppingCart,
      modifyProperty: true,
    })
  },
  /**
   * 显示购物车详情
   */
  showShoppingCartDetail: function (e) {
    var status = e.currentTarget.dataset.status
    var shoppingCart = this.data.shoppingCart
    console.log(e)
    //第1步：创建动画实例
    var animation = wx.createAnimation({
      duration: 200,
      transformOrigin: '50% 100% 0'
    })

    //第2步：这个动画实例赋给当前动画实例
    this.animation = animation

    //第3步：执行第一组动画
    animation.opacity(0).scaleY(0).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).scaleY(1).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })
    }.bind(this), 200)

    if (status == 'open') {
      this.setData({
        hiddenShoppingCartDetail: !this.data.hiddenShoppingCartDetail
      })
    }
    if (status == 'close') {
      this.setData({
        hiddenShoppingCartDetail: true
      })
    }
  },
  /**
   * 支付按钮
   */
  pay: function (e) {
    var userInfo = getApp().globalData.userInfo
    var shoppingCart = this.data.shoppingCart
    var orderFood = []
    for (var food of shoppingCart) {
      if (food.num > 0) {
        var foodProperty = ''
        if (food.pricePropertyString.length > 0) {
          foodProperty = food.pricePropertyString
          if (food.propertyString.length > 0) {
            foodProperty = foodProperty + ',' + food.propertyString
          }
        } else if (food.propertyString.length > 0) {
          foodProperty = food.propertyString
        }
        var order = {
          foodId: food.foodId,
          foodName: food.foodName,
          singlePrice: food.price,
          orderNum: food.num,
          foodProperty: foodProperty,
        }
        orderFood.push(order)
      } else {
        continue
      }
    }
    getApp().globalData.order = {
      openId: userInfo.openId,
      shopId: 1,
      tableId: 1,
      cost: this.data.allPrice,
      date: util.getCurrentDateYMD(),
      time: util.getCurrentTimeHM(),
      ifEatHere: this.data.ifEatHere,
      ifFinish: 0,
      orderFood: orderFood,
    }
    wx.navigateTo({
      url: '../eatHereOrder/eatHereOrder',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 后台操作
   */
  toBackGround: function () {
    var ifToBackGround = this.data.ifToBackGround
    if (ifToBackGround) {
      wx.reLaunch({
        url: '../unFinishOrder/unFinishOrder',
      })
    }
  },
  /**
   * 打开菜单
   */
  showMenu: function () {

    var menuAnimation = wx.createAnimation({
      duration: 10,
      transformOrigin: '50% 100% 0'
    })
    var menuBackAnimation = wx.createAnimation({
      duration: 10,
    })
    menuAnimation.opacity(0).scaleY(0).step()
    menuBackAnimation.opacity(0).step()

    this.setData({
      menuAnimation: menuAnimation.export(),
      menuBackAnimation: menuBackAnimation.export()
    })
    setTimeout(function () {
      this.setData({
        ifHiddenMenu: false
      })
      setTimeout(function () {
        menuAnimation.opacity(1).scaleY(1).step({ duration: 300, transformOrigin: '50% 100% 0' })
        menuBackAnimation.opacity(0.5).step({ duration: 300, })
        this.setData({
          menuAnimation: menuAnimation.export(),
          menuBackAnimation: menuBackAnimation.export()
        })
      }.bind(this), 50)

    }.bind(this), 10)
  },
  /**
   * 关闭菜单
   */
  hiddenMenu: function () {
    var menuAnimation = wx.createAnimation({
      duration: 300,
      transformOrigin: '50% 100% 0'
    })
    var menuBackAnimation = wx.createAnimation({
      duration: 300,
    })
    menuAnimation.opacity(0).scaleY(0).step()
    menuBackAnimation.opacity(0).step()

    this.setData({
      menuAnimation: menuAnimation.export(),
      menuBackAnimation: menuBackAnimation.export()
    })
    setTimeout(function () {
      this.setData({
        ifHiddenMenu: true
      })
    }.bind(this), 300)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      orderDateIndex: e.detail.value
    })
  },
})


