import Event from "../lib/Event.js";
//获取全局app对象
const app =getApp();
//公共数据的发送和保存
export default class PageModule extends Event {

  //筛选对象
  static filterObj(obj){
    const events = {},
          data  = {};
    if (obj){
      Object.keys(obj).forEach(key=>{
        if(/function/i.test(obj[key])){
          events[key] = obj[key];
        }else{
          data[key] = obj[key]
        }
      })
    }
    return {events,data};
  }

  //构造函数
  constructor(data) {
    super();

    //一开始就注册了事件；
    const pageExample = this;
    this.addEvent("onShow", function () {
      // console.log(this)this为page实例；
      Reflect.set(app, 'pages', {
        example: pageExample,
        page: this,
        route: this.route
      });
    });
    //判断是否传入data
    data && this.extend(data)
  };
  
  //初始化方法
  init(data){
    //判断是否传入data
    data && this.extend(data)
    Page(this);
  };  

  //导出实例
  exports(...arg) {
    //需要导出的时间
    arg = arg.length ? arg : Object.keys(this.events);
    const events = {};
    arg.forEach(eType=>{
      if(/function/i.test(typeof this[eType])){
        events[eType] = this[eType];
      }else{
        throw new Error('不存在'+eType+'事件')
      }
    })
    return events;
  }

  //导入实例
  extend(obj){
    const { events, data } = PageModule.filterObj(obj);
    //添加事件
    for(let eType in events){
      this.addEvent(eType,obj[eType])
    }
    // //判断原本是否有data属性
    // if(this.data && data.data){
    //   Object.assign(data.data,this.data)
    // }      //会导致一开始就有很多数据
    //添加属性
    Object.assign(this,data);
  }

}