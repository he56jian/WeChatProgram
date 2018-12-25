import myArray from "../lib/ArrayEx.js";

//事件类
export default class Event{
  //构造方法
  constructor(){
    //创建一个this.events对象；设置不能枚举；其值为{}；相当于不能枚举的this.events = {}
    //用来保存事件监听的类型和方法；
    Object.defineProperty(this,'events',{
      value:{},
      enumerable:false
    })
  }

  //事件队列触发器
  //触发的事件类型，触发的对象
  static createEventHandle(eType,that){
    //生成出发器包装函数
    Reflect.set(that,eType,function(...arg){
      if (eType === 'onLoad'){
        const argData = arg[0];     //因为argData是指向类型的函数，给它赋值就是给arg[0]赋值
        Object.keys(argData).forEach(key=>{
          // onload事件需要进行解码
          argData[key] = decodeURIComponent(argData[key]);
        })
        
      }

      //将页面的this实例保存起来
      const page = this,
            data = [];
      //拷贝事件队列方法
      let eTypeFn = Array.from(Reflect.get(that.events,eType));
      // console.log(eTypeFn, that.events[eType]);
      //使用了array.from之后eTypeFn的修改，不会影响that.events[eType]
      // let eTypeFn = Reflect.get(that.events, eType);

      //递归执行队列
      (function reur(){
        //每次出列第一个
        const f = eTypeFn.shift();
        //如果不是空，则执行；
        f && data.pushNameSpace(f.apply(page,arg));
        //判断队列是否为空，不为空，则递归
        eTypeFn.length && reur();
      }());
      return data;
      // eTypeFn.forEach(fn=>{
      //   //微信小程序函数自执行，this指向本身；
      //   fn.apply(page,arg);
      //  })
    })
  }
    //获取事件队列
    getEvent(eType){
      let eTypeFn = Reflect.get(this.events,eType);
      //判断是否为空
      if(!Array.isArray(eTypeFn)){
        eTypeFn = [];
        Reflect.set(this.events,eType,eTypeFn);
        //相当于this.event[eType] = eTypeFn
        //保存事件触发器
        Event.createEventHandle(eType,this);
      }
      return eTypeFn;
    }

    //添加一个事件监听；
    addEvent(eType,callback){
      const eTypeFn = this.getEvent(eType);
      //添加到事件队列；
      eTypeFn.push(callback);
    }

    //删除事件监听
    removeEvent(eType,callback){
      //带有callback，指定删除某个
      if(callback){
        //获取事件队列
        const eTypeFn = this.getEvent(eType),
          index = eTypeFn.findIndex(item=>item === callback);
          if(index != -1){
            eTypeFn.splice(index,1);
          }    //直接这样删除，会导致边删除边执行，有可能会有执行不到的情况
        // index != -1 && setTimeout([].splice.bind(eTypeFn, index, 1),0);      //这个方法不会执行，是为什么？
      }else{
        //清空
        Reflect.set(this.events,eType,[]);    //把this.events[eType] = [];
      }
    }

    //一次性事件
    oneEvent(eType,callback){
      const that = this;
      const handle = function(...arg){
        callback.apply(this,arg);//这个指向的是全局的app对象；
        that.removeEvent(eType,handle);
      }
      that.addEvent(eType,handle)
    }
} 