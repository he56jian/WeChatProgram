
const Utils = {
  //时间对象转成yyyy-mm-dd
  trainDate(date) {
    return date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate();
  },
  //根据输入的日期得到是星期几
  queryWeek(date) {
    let startweek = new Date(date).getDay();
    switch (startweek) {
      case 0:
        return '日';
      case 1:
        return '一';
      case 2:
        return '二';
      case 3:
        return '三';
      case 4:
        return '四';
      case 5:
        return '五';
      case 6:
        return '六';
    }
  },
  //showapi的请求时间格式
  formatterDateTime() {
    var date = new Date();
  var month = date.getMonth() + 1
    var datetime = date.getFullYear()
                  + ""// "年"
                  + (month >= 10 ? month : "0" + month)
                  + ""// "月"
                  + (date.getDate() < 10 ? "0" + date.getDate() : date
                    .getDate())
                  + ""
                  + (date.getHours() < 10 ? "0" + date.getHours() : date
                    .getHours())
                  + ""
                  + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                    .getMinutes())
                  + ""
                  + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                    .getSeconds());
    return datetime;
  },
  //分钟转小时
  minToString(minute){
    return ~~(minute/60) + '时' + minute%60+'分';
  }
}
module.exports = Utils;