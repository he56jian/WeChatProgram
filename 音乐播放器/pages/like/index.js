
import PageModule from "../../lib/Page.js";
import $PageMusic from "../../model/PageMusic.js";
import LikeSong from "../../model/LikeSong.js";
import utils from "../../utils/utils.js";

const $like_db = new LikeSong();
const default_album = "/images/default.jpg";
const $Page = new PageModule({
  onLoad(){
    //获取用户信息
    utils.getUserInfo()
         .then(userInfo=>{
           this.setData({
             userInfo
           })
         })

    const list = $like_db.order('time','desc').all();
    const cover = list[0] ? list[0].album_big : default_album;      //封面图
    this.setData({
      list,cover
    })
  },
  //封面图获取失败
  coverError(){
    cover: default_album
  },
  //每次跳转都运行
  onShow(){
    const list = $like_db.order('time', 'desc').all();
    const cover = list[0] ? list[0].album_big : default_album;      //封面图
    this.setData({
      list, cover
    })
  }

});

$Page.extend($PageMusic);
$Page.init();