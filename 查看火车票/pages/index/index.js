const utils = require('../../utils/utils.js');
Page({
  data: {
    startTime:'',   //当前时间
    endTime:'',     //最大日期
    startWeek:'',
    trainDate:'',      //设置的开始时间
  },
  
  onLoad: function () {
    //初始化时间
    this.initTime();
   
  },
  //初始化时间；
  initTime(){
    // const newDate = new Date();//获取电脑时间；
    // 请求服务器时间
    this.requeryNowDate();
    
  },   
  trainDate(e){
    let trainDate = e.detail.value;
    let startWeek = utils.queryWeek(trainDate);
    this.setData({
      trainDate,
      startWeek
    });
  },
  //请求服务器时间；
  requeryNowDate() {
    wx.request({
      url: 'https://www.showapi.com',
      method: 'HEAD',
      success:(res)=>{
        //如果使用function()就不行；因为箭头函数没有this，会指向根目录
        let newDate =  new Date(res.header.Date);
        let startTime = utils.trainDate(newDate);
        const endDate = new Date(newDate.getTime() + 29 * 24 * 60 * 60 * 1000);
        let endTime = utils.trainDate(endDate);
        let startWeek = utils.queryWeek(newDate);
        this.setData({
          startTime,
          endTime,
          startWeek
        })
      }
    })
  },
  //表单提交数据
  query(e){
    let data = e.detail.value;
    let values = Object.values(data);
    let empty = false;
    /**
     * 使用if(/.+&.+&.+/.test(values.join($)))判断是否为空
     * 
     */

    values.forEach(item=>{
      if(!item){
        empty = true;
        wx.showToast({
          title: '缺少必填项',
          icon:'none'
        })
      }
    });
    if (!empty){
      wx.navigateTo({
          url: '../list/list?' + this.objDeUCode(data)
      })
    }
  },
  // //把数据打包成url格式
  objDeUCode(data){
    return Object.keys(data).map(item=>item+'='+data[item]).join('&');
  }
})
