import PageModule from "../lib/Page.js";
import AudioManager from "../lib/AudioManager.js";
const audio = AudioManager.audio;


const $Page = new PageModule({
  data:{
    psongshow:false,
    noFir:false
  },
  onLoad(){
    
  },
  //显示歌单
  showPsong(){
    this.setData({
      psongshow: !this.data.psongshow, 
      noFir:true

    })
  },
  //删除歌单中的一条数据
  playSongDel(e){
    const song = e.target.dataset.song,
      index = this.data.playSongs.findIndex(item => item.song_mid === song.song_mid);
      //获取遍历的songs中有和songId 一样的序号
        //删除该项目
        this.data.playSongs.splice(index,1);
        this.setData({
          playSongs:this.data.playSongs
        })
  },

  //监听功能按键
  musicTap(event) {
    //需要出发的方法名；
    const method = event.target.dataset.method;
    Reflect.has(AudioManager, method) && Reflect.apply(AudioManager[method], this, [event]);
  },

  //播放歌曲
  onPlayer(event) {
    //要播放的歌曲，及歌单
    let song = event.target.dataset.song,
      songs = event.currentTarget.dataset.songs;
   
    //单击到了歌曲选项
    if (song) {
      //设置当前要播放的歌曲及歌单
      AudioManager.setSong(song, songs);
      this.setData({
        playSong:song,
        playSongs:songs
      })
    }
  },

  //获取歌曲数据
  onShow() {
    //保存监听audio的所有事件
    const audioEvents = [
      'onCanplay', 'onWaiting', 'onError', 'onPlay', 'onPause', 'onSeeking', 'onSeeked', 'onEnded',
      'onStop', 'onTimeUpdate', 'onNext', 'onPrev'
    ]
    //事件代理触发函数
    const trigger = e => {
      Reflect.apply(audio[e], this, [(...reg) => {
        Reflect.has(this, e) && Reflect.apply(this[e], this, reg)
      }]);
    }
    //监听事件
    audioEvents.forEach(trigger)
    //获取当前要播放的歌曲及歌单
    const data = AudioManager.getSong();
    this.setData(data)
  },
  //更新音乐信息
  onTimeUpdate(){
    //需要更新的数据
    const updata = {
      duration: audio.duration,     //音频长度
      currentTime: audio.currentTime, //当前播放位置
      paused:audio.paused,            //当前播放状态
      buffered: audio.buffered,       //当前缓冲时间
    }
    //数据合并
    Object.assign(this.data.playSong,updata);
    this.setData({
      playSong:this.data.playSong
    })
  },
  //歌曲播放错误
  onError(){
    wx.showToast({
      icon:"none",
      title: '歌曲跑丢了！',
    })
  },

  //播放完成事件
  onEnded(){
    AudioManager.songTap.call(this, true);
  }

});

export default $Page;
