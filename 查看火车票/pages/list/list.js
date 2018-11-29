const utils = require('../../utils/utils.js');
const appID = 81592;      //appID 
const appSign = '4ce8a46ae0bf4b59b7df0e058b05188a',//秘钥,签名
      appUrl = 'http://route.showapi.com/909-1';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from:'',    //选择的出发城市
    to:'',      //选择的到达城市
    trainDate: '', //选择的出发日期

    // num: '',   //火车号
    // beginCity:'', //火车开始城市
    // endCity:''  , //火车最终到达城市
    // fromTime:'',  //火车发车时间
    // toTime:'',    //火车抵达时间
    // usedTime:'',  //火车运行时间
    // fromCity:'',    //出发城市
    // toCity:''       //到达城市
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);
    this.query(options)
        .then(this.codeData.bind(this));
  },
  //请求数据
  query(optionsData){
    return new Promise((resolve)=>{
        wx.request({
          url: appUrl,
          mothed: 'POST',
          header: {
            "content-type": "application/json"
          },
          data: Object.assign({
            "showapi_timestamp": utils.formatterDateTime(),
            "showapi_appid": appID, //这里需要改成自己的appid
            "showapi_sign": appSign,  //这里需要改成自己的应用的密钥secret
          }, optionsData),
          success: resolve
      })
    })
  },
  //打包数据
  codeData(res){
      let resBody = res.data.showapi_res_body,
          trains = [];
    if (resBody.ret_code === -1) {
        wx.showToast({
          title: resBody.msg,
          icon: 'none'
        });
        setTimeout(function () { wx.showToast({ title: '2s后返回', icon: 'none' }) }, 500);
        setTimeout(wx.navigateBack, 2000);
      } else {
        //遍历所有的列车
        resBody.trains.forEach(item=>{
          const ticketInfo = Object.values(item.ticketInfo),      //获取所以的票面信息
            price = Math.min.apply(null, ticketInfo.map(item=>{
                  return item.price;
            }))     //先把ticketInfo的每一个加个都打包成数组，再用Math.min找出最小值
            if(ticketInfo.length){
              trains.push({
                ticketInfo: item.ticketInfo,
                price,
                fromTime: item.fromTime,
                num:item.num,
                toTime:item.toTime,
                usedTime: utils.minToString(item.usedTime),
                fromCity:item.fromCity,
                toCity:item.toCity,
              });
            }
        })
      }
      //根据价格排序
      //对象的排序，10个以内就是正常的，以上就会出现问题；其返回值必须是-1,0,1三个来排序；
      // trains.sort((a,b)=>{
      //if(a.price>b.price){
//        return -1;
      // }else{
//        return 1;
      // }
      //   return a.price > b.price;
      // })
      this.setData({trains})
    }
})