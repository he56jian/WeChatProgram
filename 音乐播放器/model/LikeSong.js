//用于保存收藏的歌单数据信息
import Stroage from "../lib/storage.js";

const dbname = 'like_song';

export default class LikeSong extends Stroage{

  //验证是否收藏了歌曲
  has(mid){
    return this.where('song_mid',mid).find() ? true:false; //判断是否存在mid
  }

  //添加收藏
  add(song){

    const dataKey = ['song_mid', 'song_name', 'song_orig', 'album_min', 'album_big'],
          data = {};
          dataKey.forEach(key=>data[key] = song[key]);
    super.add(Object.assign({
      time:new Date().getTime()
    }, data)).save();
  }

  //删除收藏
  del(song){
    //查找到数据
    this.where('song_mid',song.song_mid);
    super.del().save();
  }

  constructor(){
    super(dbname);
  }
}
