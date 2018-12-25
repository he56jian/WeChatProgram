
import { request} from "../../common/const.js"; 
import PageModule from "../../lib/Page.js";
import AudioManager from "../../lib/AudioManager.js";
import $PageMusic from "../../model/PageMusic.js";
import LikeSong from "../../model/LikeSong.js";

const audio = AudioManager.audio;     //全局的背景播放器
//收藏歌单的本地存储
const $like_db = new LikeSong();
const $Page = new PageModule({
  
  onLoad(event){
    //为什么this.data里面有playSong 但是使用this.data.playSong就为undefined
    
    wx.setNavigationBarTitle({
      title: event.name 
    });
    //初始数据
    this.setData({
      multiple: 8,
      duration: 150,
      current: 0,
      currentIndex: 0
    });
    //收藏状态
    this.setData({
      like: $like_db.has(event.mid)
    });

    this.getLyrics(event.mid)
  },
  // https://api.atoz.ink/lyrics/id
  //获取歌词
  getLyrics(mid){
    const url = request.lyrics + mid;   //请求的url
    new Promise((resolve,reject)=>{
      wx.request({
        url: url,
        success:resolve,
        fail:reject
      })
    }).then((res)=>{
      const lyrics = res.data.lyric;
      if(lyrics.length === 1){
        this.setData({multiple:1})
      }else{
        this.setData({ multiple: 8 })
      }
      if(lyrics.length === 0){
        lyrics.push({
          millisecond: 0,
          second: 0,
          date: "00: 00.00",
          text: "暂无歌词"
        })
      }
      //获取歌词数组
      this.setData({lyrics})
    }).catch((error)=>{

    })
  },

  //设置进度条
  setSeek(event){
    const time = event.detail.value;
    //设置进度条
    AudioManager.trigger('seek',this,time)
  },
  //每次播放准备就绪时获取歌词(因为我是所有的歌曲都是同一个URL，有可能不会触发)
  onCanplay(){
    wx.setNavigationBarTitle({
      title: this.data.playSong.song_name,
    });
    this.getLyrics(this.data.playSong.song_mid);
    //更新收藏状态
    this.setData({
      like: $like_db.has(this.data.playSong.song_mid)
    });
    console.log(this.data.playSong,this.data.like);
  },

  //进度条更新事件
  onTimeUpdate(){
    //如果获取的歌词为空就不滚动
    if(!this.data.lyrics || !this.data.lyrics[0]){
      return false ;
    }
    let currentTime = ~~(audio.currentTime*1000);   //获取播放的毫秒数
     //获取歌词的项目数
    let currentIndex =  this.data.lyrics.findIndex(item=>
      item.millisecond > currentTime)  ;     //判断当前歌词所在下标
    currentIndex = Math.max(0,currentIndex); 
    // //判断是否为最后一句歌词
    if (currentTime >= this.data.lyrics[this.data.lyrics.length - 1].millisecond){
      currentIndex = this.data.lyrics.length-1;
    }else{
      --currentIndex;
    }
    // 页面滚动的下标，当为0时，页面不滚动，
    let current = Math.max(0, currentIndex - ~~(this.data.multiple/2));
    //判断歌曲是否到了最后一页
    current = Math.min(current,this.data.lyrics.length - this.data.multiple)
    this.setData({
      currentIndex, current
    })    
  }
  
});
$Page.extend($PageMusic);
$Page.init();


//在播放中切换下一首，歌词显示没变； 