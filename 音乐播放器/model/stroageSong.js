import Stroage from "../lib/storage.js";

const dbname = 'stroage_song';

export default class stroageSong extends Stroage{

  constructor(){
    super(dbname);
  }
  //添加歌曲缓存
  add(songName){
    // 如果输入的是新的搜索内容添加进缓存
    if(!this.where('name',songName).find()){
      super.add({
        name: songName,
        time: new Date().getTime()
      }).save();
    }
  }

  //获取所有缓存的歌单
  all(){
    //将数据倒序；
    this.order('time', 'desc');
    
    const db = super.all();

    //截取前5条数据
    const data = db.splice(0,5);

    // db.forEach(songItem=>{
    //   this.del(songItem.name)
    // })
    return data;
  }
  //删除数据
  del(songName){
    this.where('name',songName);//构建查询方法
    // console.log(this.whereFn, this.whereFn.compare);
    //调用父级的删除方法
    super.del().save();
  }
}