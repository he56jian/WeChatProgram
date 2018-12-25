import PageModule from "../../lib/Page.js";
import Banner from "../../model/Banner.js";
import {regin,sheet,request} from "../../common/const.js";
import storage from "../../lib/storage.js";
import PageMusic from "../../model/PageMusic.js";
import utils from "../../utils/utils.js";

//页面的命名空间
const $namespace = 'index/index';
//实例化page模型
const $Page = new PageModule({
  
 
  // 监听onload事件
  onLoad(o){
    //获取用户信息
    utils.getUserInfo()
         .then(userInfo=>{
           this.setData({
             userInfo
           })
         })

    const banner = new Banner(this);
    banner.getBanner()
          .then((data)=>{
            this.setData({
              banner:data,
            })
          });
    //设置国家信息
    this.setData({
      regin
    })
  
    // 因为当前的this不是当前的page,要添加一个命名空间
    const p = this.getSheet()
      .findNameSpace($namespace)
      .then(this.setSheet.bind(this));
  },

  //获取歌单信息
  getSheet(){
    const sheetPromise = [];
    sheet.forEach(item=>{
      //歌单类型请求
      const p = new Promise(res=>{
        const url = request.topid+ item.id;
        wx.request({
          url: url,
          success:res
        })
      });
      sheetPromise.push(p);
    })
    return {
      nameSpace: $namespace,
      data: Promise.all(sheetPromise)
    };
  },

  //设置歌单信息
  setSheet(arg){
    const sheetDate = [];
    arg.forEach((res,key)=>{
      sheetDate.push(Object.assign({
        songs:res.data.songs
      },sheet[key]));
    });
    this.setData({sheet:sheetDate});
  }
});
$Page.extend(PageMusic);
$Page.init();

