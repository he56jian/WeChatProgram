

Page({
  data: {
    startTime:'',   //当前时间
    endTime:'',     //最大日期
    gotime:'',      //设置的开始时间
    endtime:''      //设置的结束时间
  },
  
  onLoad: function () {

    this.initTime();
   
  },
  //初始化时间；
  initTime(){
    const newDate = new Date();
    let startTime = this.goDate(newDate);
    const endDate = new Date(newDate.getTime()+29*24*60*60*1000);
    let endTime = this.goDate(endDate);
    this.setData({
      startTime,
      endTime
    })
  },   
  //时间对象转成yyyy-mm-dd
  goDate(date){
    return date.getFullYear() + '-' +
          (date.getMonth() + 1) + '-' +
          date.getDate();
  },           
  goTime(e){
    this.setData({
      gotime:e.detail.value
    });
  },
  endTime(e){
    this.setData({
      endtime: e.detail.value
    });
  },
  //请求数据
  query(e){
    let data = e.detail.value;
    let values = Object.values(data);
    let empty = false;
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
