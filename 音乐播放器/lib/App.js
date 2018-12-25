import Event from "../lib/Event.js";
//当前app.js并没有执行，所以getApp()获取不到app实例
let app;
//公共数据的发送和保存
export default class AppModule extends Event{

  // //全局数据
  globalData = {a:1};
  //构造函数
  constructor(){
    super();
  }

  //设置页面参数，给当前页设置，不用在实际显示的页面设置数据，通过assign代理直接给当前页设置；
  static assign(key,val){
    //当app还不存在，页面也不存在的时候，把这个执行调到最后;等等app的onLoad执行；
    if(!app || !app.pages){
      return setTimeout(AppModule.assign.bind(null,key,val),0);
    }
    // console.log(key);
    //拿到当前页面显示的实例
    let page = app.pages.page,
      //因为app.assign方法在$Page.init();前执行；所以找不到app.page.page
        kType = typeof key;
    if(/string/i.test(kType) && val){
      page.setData({
        [key]:val
      })
    }else if(/object/i.test(kType)){
     
      page.setData(key);
    }

  }


  //用于修改全局数据，
  //参数为空，返回全局数据的对象
  //参数为‘number',返回全局对象中的number数据
  //参数为’number‘，123，为设置number = 123；
  //参数为对象，也为设置
  data(...arg){
    if(arg.length === 0){
      //没有参数直接返回
      return this.globalData;
    }else if(arg.length === 1){
      const kType = typeof arg[0];
      if(/string/i.test(kType)){
        //如果只有一个参数，并且为字符串时
        return this.globalData[arg[0]];//获取某一项
      }
      if(/object/i.test(kType)){
        const data = arg[0];
        for(let key in data){
          this.data(key,data[key])
        }
      }
    }else if(arg.length === 2){
      //长度为2,进行设置；
      this.globalData[arg[0]] = arg[1]
    }
  }

  //初始化方法
  //必须调用app/page方法；
  init(){
    // let that = this;      //this就是AppModule
    // console.log(this);    //为什么不会记录方法到app对象中，而且this里没有init方法；
    const appExample = this;
    this.oneEvent("onLaunch",function(){
      Reflect.set(this,'example',appExample);
      app = this;//拿到app实例；
    })
    //App方法方法调用的时候接收一个对象，会通过浅拷贝的方法将数据添加到app方法里;浅拷贝：只去拷贝指针，不拷贝副本；
    App(this);
  };
}