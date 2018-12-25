

import PageModule from "../../lib/Page.js";
import { request } from "../../common/const.js";
import $PageList from "../../model/PageList.js";
import stroageSong from "../../model/stroageSong.js";
import $PageMusic from "../../model/PageMusic.js";
//歌曲的缓存类；
const $stroage_song = new stroageSong();
let $Page = new PageModule($PageList);

$Page.extend($PageMusic);

$Page.init({
  //打包请求URL
  onLoad(querys){
    //需要搜索的歌名
    const songName = querys.searchVal;
    //搜索链接http://api.atoz.ink/quety/小练习/26/p/2
    this.data.url = request.query + songName;

    //显示导航标题
    wx.setNavigationBarTitle({
      title: songName || "",
    })
    //开始加载数据
    this.loadPage();
  },

  //搜索表单
  query(event){
    //搜索表单数据
    const data = event.detail.value;
    if (!data.searchVal) {     //如果没有输入要搜索的歌名
      return wx.showToast({
        title: '请输入要搜索的歌名或作者名',
        iocn: 'none'
      })
    }

    //重新调用onLoad
    this.onLoad(data);
    $stroage_song.add(data.searchVal);
  },

});