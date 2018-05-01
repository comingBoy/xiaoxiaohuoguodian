module.exports = {
  getPeriod: function(date0, time, callback) {
    var date = date0
    var dateArray = date.split("-");
    for (var i = 0; i < 3; i++) {
      dateArray[i] = parseInt(dateArray[i])
    }
    var MMDD = dateArray[1].toString() + '月' + dateArray[2].toString() + '日'
    date = new Date()
    var week = "星期" + "日一二三四五六".charAt(date.getDay());
    var meal
    if (time_range('00:01','10:00',time)) meal = '早餐'
    else if (time_range('10:01', '15:00', time)) meal = '午餐'
    else meal = '晚餐'
    var period = MMDD + ' ' + '(' + week + ')' + ' ' + meal
    callback(period)
  }
}

function time_range(beginTime, endTime, nowTime) {
  var strb = beginTime.split(":");
  if (strb.length != 2) {
    return false;
  }

  var stre = endTime.split(":");
  if (stre.length != 2) {
    return false;
  }

  var strn = nowTime.split(":");
  if (stre.length != 2) {
    return false;
  }
  var b = new Date();
  var e = new Date();
  var n = new Date();

  b.setHours(strb[0]);
  b.setMinutes(strb[1]);
  e.setHours(stre[0]);
  e.setMinutes(stre[1]);
  n.setHours(strn[0]);
  n.setMinutes(strn[1]);

  if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
    return true;
  } else {
    return false;
  }
}
