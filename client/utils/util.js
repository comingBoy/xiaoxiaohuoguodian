const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var getCurrentDateYMD = function(){
  var myDate = new Date()
  var year = myDate.getFullYear()
  var month = myDate.getMonth() + 1
  var day = myDate.getDate()
  year = year.toString() 
  month = month < 10 ? '0' + month : month.toString() 
  day = day < 10 ? '0' + day : day.toString()
  return year + '-' +month + '-' + day
}

var getYesterdayDateYMD = function () {
  var myDate = new Date()
  myDate.setTime(myDate.getTime() - 24 * 60 * 60 * 1000);
  var year = myDate.getFullYear()
  var month = myDate.getMonth() + 1
  var day = myDate.getDate()
  year = year.toString()
  month = month < 10 ? '0' + month : month.toString()
  day = day < 10 ? '0' + day : day.toString()
  return year + '-' + month + '-' + day
}

var getCurrentTimeHM = function(){
  var myDate = new Date()
  var hours = myDate.getHours() //获取当前小时数(0-23)
  var min = myDate.getMinutes() //获取当前分钟数(0-59)
  hours  = hours < 10 ? '0' + hours : hours.toString()
  min = min < 10 ? '0' + min : min.toString()
  return hours + ':' + min
}
module.exports = { formatTime, showBusy, showSuccess, showModel, getCurrentDateYMD, getYesterdayDateYMD, getCurrentTimeHM }
