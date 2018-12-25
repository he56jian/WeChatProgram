//不同的对比方法
const whereCompare = {
  "=":function(that,value){
    return that == value;
  },
  ">=": function (that, value) {
    return that >= value;
  },
  "<=": function (that, value) {
    return that <= value;
  },
  "!=": function (that, value) {
    return that != value;
  },
  ">": function (that, value) {
    
    return that > value;
  },
  "<": function (that, value) {
    return that < value;
  },
  "like":function(that,vlaue){
    return new RegExp(value,'i').test(that);
  }

}

//导出默认类
export default class storage{
  //构造函数
  constructor(dbname){
    Object.assign(this,{
      dbname,// 数据库名
      cache:{
        add:{
          data:[]
        }
      }      //用于存放数据缓存，存档和读档
    });
  }

  //静态方法，用于在每次调用的都是同一个；
  static getDb(dbname){
    return wx.getStorageSync(dbname) || [];
  }

  //静态方法，获取每个的查询方法
  static getWhere(action){
    //当已经构建了查询语句的时候
    if (this.whereFn){
    const whereFn = this.whereFn;
      //清空whereFn,防止上一个污染后面的
      this.whereFn = null;
      return whereFn;
    }else{
      throw new Error('调用'+action+'前请使用 where 方法构建查询语句')
    }
  }
  

  //添加方法
  add(data){
    //判断数据格式是否为数组
    if(Array.isArray(data)){
      data.forEach(item=>{
        this.add(item)
      })
    }else if (/object/.test(typeof data)) {//判断数据格式是否为对象
      
      //先保存到缓存
      this.cache.add.data.push(data);
    }else{
      throw new Error("add方法接收对象参数")
    }
    return this;
  }
  //删除方法
  del(){
    this.cache.del = {
      where:storage.getWhere.call(this,'del')
    }
    return this;
  }

  //清除
  clear(){
    this.clearFn = ()=>{
    }
    this.cache = []
    return this;
  }


  //更改数据
  updata(data){
    if(/object/i.test(typeof data)){
      //传递进来的数据必须是对象格式
      this.cache.updata = {
        data,
        where: storage.getWhere.call(this,'updata')
      }
    }else{
      throw new Error('传进的参数必须是对象')
    }
    return this;
  }

  //构建查询语句
  where(...args) {
    let [key, compare, value] = args;
    
    //如果传入的参数为对象
    if (/object/i.test(typeof key)){
      for(let k in key){
        if(Array.isArray(key[k])){
          this.where(k,...key[k]);
        }else{
          this.where(k,key[k])
        }
        // this.where(k,...(key[k]+'').split(','));//使用该方式会对传进来的参数进行类型转换，如果是undefined就会发生错误
       
      }
      
      return this;
    }
    //如果传入的第三个参数为空
    if (value === undefined) {
      //当只传了两个参数时
      value = compare;
      compare = '=';
    }
    const compareFn = whereCompare[compare];      //获取对应的对比方法
    if (compareFn) {
      //判断是否为第一次进来
    
      if(!this.whereFn){
        const whereFn = (item)=>{   //item为每一项存储的数据；
          let compareNum = 0;
          if (item){
            //用来计数，统计成功的条件
            whereFn.compare.forEach((compareItem) => {
              compareNum += ~~compareItem.compareFn(item[compareItem.key], compareItem.value);
            });
          }
          //添加多个的时候，如果对比多组条件和条件长度一致 ；
          return compareNum === whereFn.compare.length;
        } 
        this.whereFn = whereFn;
        //定义数组存储对比方式
        whereFn.compare = [];
      }
     
      this.whereFn.compare.push({
        key,compareFn,value
      });
    } else {
      throw new Error('不存在 ' + compare + ' 的对比方法')
    }
    return this;
  }

  //排序方式，默认正序
  order(key,sort='asc'){
    this.sortFn = (a,b)=>{
      return /desc/i.test(sort) ? b[key] - a[key] : a[key] - b[key];
    }
    return this;
  }
  
  //筛选数据
  limit(start,end){
    if(end === undefined){
      end = start;
      start = 0;
    }else{
      --start;
      end +=start;
    }
    this.limitFn = [start,end];
    return this;
  }

  //查找一条数据
  find() {
    //获取本地数据
    const db = storage.getDb(this.dbname);
    //如果需要排序
   
    return db.find(storage.getWhere.call(this, 'find'));//相当于db.find((item)=>{return compareFn(item[key],value)});find()会遍历,回调结果为真时，返回获取到的数据    ;;数组的find()方法；
  }

  //查询多条数据
  select(){
    const db = storage.getDb(this.dbname);
    let data = db.filter(storage.getWhere.call(this, 'select'));
    this.sortFn && data.sort(this.sortFn);
    return this.limitFn ? data.slice(...this.limitFn) : data;
  }

  //查询所有数据
  all(){
    //直接拿数据库数据
    const data =  storage.getDb(this.dbname);
    this.sortFn && data.sort(this.sortFn);
    return this.limitFn ? data.slice(...this.limitFn) : data;
  }


  //将缓存保存到本地数据
  save(){
    //保存时要先获取本地数据，再添加，否则，会直接覆盖
    let db = storage.getDb(this.dbname);
    if(db.length){
    
      //是否存在删除缓存
      if (this.cache.del) {
        //筛选数据库所有的对象
        db = db.filter((item=>{
          return !this.cache.del.where(item);
        }))
        console.log(db);
      }
      
      // //删除方法2
      // if(this.cache.deleteAll){
      //   db = db.filter((item)=>{
      //     return !storage.getWhere.call(this,item)
      //   })
      // }
    }
    
    //是否存在更新缓存，要写在add前面是防止把添加的数据更改了；
    if(this.cache.updata){
      db.forEach((item)=>{
        if(this.cache.updata.where(item)){
          Object.assign(item,this.cache.updata.data)
        }
      })
    }
    //是否存在添加缓存
    if(this.cache.add){
      db.push(...this.cache.add.data)
    }

    //更新本地数据
    wx.setStorageSync(this.dbname, db);
    //更新缓存
    this.cache = {
      add:{
        data:[]
      }
    }
    return db;
  }

}