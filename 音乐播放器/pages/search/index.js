import pageModule from "../../lib/Page.js";
import stroageSong from "../../model/stroageSong.js";
import PageMusic from "../../model/PageMusic.js";

//歌曲的缓存类；
const $stroage_song = new stroageSong();
const $page = new pageModule({

  data:{
    searchVal:"",
    history:[]
  },
  //页面加载
  onLoad(){
    this.updata();
  },

  //搜索事件
  query(event){
    const searchVal = event.detail.value.searchVal.trim();//去掉首尾空格
    //如果输入为空
    if (!searchVal){
     return wx.showToast({
        icon: 'none',
        title: '请输入搜索内容'
      })
    }
    // if(/^\s*$/.test(searchVal)){
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请输入搜索内容'
    //   })
    // }

    $stroage_song.add(searchVal);
    this.updata();
    //跳转到列表页\
    wx.navigateTo({
      url: "list?searchVal=" + searchVal,
    })
  },

  //更新数据
  updata(){
    const history = $stroage_song.all();
    this.setData({
      history, searchVal:""
    })
  },

  //删除数据
  del(event){
    //获取歌曲名
    const song = event.currentTarget.dataset.song;

    //删除数据库中对应的歌曲
    $stroage_song.del(song);
    this.updata();
    
  }

});

$page.extend(PageMusic);

$page.init();