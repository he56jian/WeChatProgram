import AppModule from "App.js";
import stroage from "../lib/storage.js";
import LikeSong from "../model/LikeSong.js";
import utils from "../utils/utils.js";

const app = new AppModule();

//全局唯一的b背景音乐播放器
const audio = wx.getBackgroundAudioManager();
//收藏歌单的本地存储
const $like_db = new LikeSong();

//自定义的
let song_url = "http://183.60.131.112/amobile.music.tc.qq.com/C400002u26ri1tPTYn.m4a?guid=7520558681&vkey=04932A26142C5199C8884CC65D16858D3599759FD7E47C3E410BF6ECF879343CCA881955859E2957E1FBE311F7BDADF0ACB2059BC766A8FF&uin=0&fromtag=66";


const $audio_db = new stroage('audio_db');
//用于管理全局唯一的背景播放类
export default class AudioManager{

  //使用静态变量保存，方便后续引用
  static audio = audio;

  //当前播放的音乐
  static song = null;       //相当于挂在全局，当这个修改了，其他地方的song也响应修改了
  static songs = null;      //当前播放的歌单
  
  //获取当前播放的歌曲及歌单
  static getSong(){
    let data = {
      song: {},
      songs: []
    };

    Object.keys(data).forEach(key=>{
      if(AudioManager[key]){
        //类中存在数据
        data[key] = AudioManager[key];
      }else{
        //从本地数据查找
        const keyData = $audio_db.where('type',key).find();
        // 用户第一次进来，缓存是没有数据的
        if (keyData){
          //类中不存在，从缓存中找
          data[key] = keyData.data
        }
      }
    })
    return {
      playSong: data.song,
      playSongs: data.songs
    };
  }

  //事件处理接口
  static trigger(eType,that,...arg){
    //如果存在该事件则执行
    Reflect.has(audio,eType) && Reflect.apply(audio[eType],that,arg);
  }

  //通过页面代理触发的函数 this指向页面实例
  static like(){
    if($like_db.has(this.data.playSong.song_mid)){
      //存在则取消收藏
      $like_db.del(this.data.playSong)
    }else{
      //不存在则收藏
      $like_db.add(this.data.playSong)
    }
    //更新收藏状态
    this.setData({
      like:  $like_db.has(this.data.playSong.song_mid)
    });

  }

  //下载功能
  static download() {
    //     //将临时路径保存到本地缓存文件夹，  只能在微信小程序中使用，外部无法使，
    wx.showToast({
      icon:'none',
      title: '正在建设中~~',
    })

    // //需要下载的路径
    // const url = song_url;
    
    // const fils = wx.downloadFile({
    //   url,
    //   success(res){
    //     // console.log(res);   //res.tempFilePath为临时路径
    //     //将临时路径保存到本地缓存文件夹，  只能在微信小程序中使用，外部无法使
    //     wx.saveFile({
    //       tempFilePath: res.tempFilePath,
    //       success(res){
    //         console.log(res); //保存的文件夹信息,
    //       }
    //     })
    //   }
    // })
    // //监听一个下载进度事件
    // fils.onProgressUpdate((flie)=>{
    //   console.log(flie) //flie为进度的百分比，总数，已下载数
    // })


  }
  //评论功能
  static wechar() {
    const data = utils.objDeUCode(this.data.playSong);
    wx.navigateTo({
      url: "/pages/char/index?" + data,
    })
  }
 
  //歌曲切换
  static songTap(statu){
  
    let index = this.data.playSongs.findIndex(song => song.song_mid === this.data.playSong.song_mid);
    //根据状态递增或者递减
    (statu) ? ++index:--index;
    (index) %=this.data.playSongs.length;
    (index < 0) && (index=this.data.playSongs.length-1);

    //更新收藏状态
    this.setData({
      like: $like_db.has(this.data.playSongs[index].song_mid)
    });
    AudioManager.setSong(this.data.playSongs[index],this.data.playSongs);


    
  }
  //上一首
  static prev() {
    AudioManager.songTap.call(this,false);
  }
  //点击播放
  static play() {
    //audio.pause有三个状态，undefined为没有设置歌曲，true为停止，false为播放
    if(audio.paused === undefined){
      AudioManager.setSong(this.data.playSong,this.data.playSongs)
    }else if(audio.paused === true){
      audio.play();
    }else{
      audio.pause();
    }
  }

  static next() {
    AudioManager.songTap.call(this,true);
  }

  //设置当前播放的歌曲及歌单
  static setSong(song,songs){
   
    // 更新当前页面头部
    wx.setNavigationBarTitle({
      title: song.song_name,
    })

    //设置播放器的属性
    const audioAttr = {
      src:song_url,      //歌曲的URL
      title:song.song_name,     //歌曲名称
      epname:song.album_name,    //专辑名称
      singer:song.song_orig,      //歌手
      coverImgUrl:song.album_min  //封面
    }
    AudioManager.saveSongStatu(song,songs);
    Object.assign(audio,audioAttr);
  }

  //保存当前歌曲状态
  static saveSongStatu(song,songs){
    const data = { song, songs };
    //保存到类
    AudioManager.song = Object.assign({},data.song);
    //本地缓存，用于下次打开播放器时，继续听；
    //更新到页面
    //更新到页面
    AppModule.assign({
      playSong: song,
      playSongs: songs
    });

   

    //保存到类
    // 遍历需要保存的数据
    Object.keys(data).forEach(key=>{
      //保存的类型
      const where = {'type':key};
      //保存的数据
      const upData = Object.assign({},where,{
        data:data[key],
        time:new Date().getTime()
      });

      //如果原本数据库就有audio_db的数据
      if($audio_db.where(where).find()){
        $audio_db.where(where).updata(upData)
      }else{
        //数据库中没有audio_db的数据
        $audio_db.add(upData)
      }
      $audio_db.save();
    })
  }


  //构造方法
  constructor(){

  }

  
}