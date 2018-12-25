
import PageModule from "../../lib/Page.js";
import {request} from "../../common/const.js";
import PageList from "../../model/PageList.js";
import $PageMusic from "../../model/PageMusic.js";
const $Page = new PageModule(PageList);

$Page.addEvent('onLoad', function (option){

  // Object.assign(this.data,{
  //   page: 1,//加载第几页
  //   row:60,//每页多少条数据
  //   songs:[]
  // });
    
   //设置导航标题
    wx.setNavigationBarTitle({
      title: option.name,
    })
    this.data.url = request.topid + option.id;
//     //开始请求数据
    this.loadPage();
})
$Page.extend($PageMusic);
$Page.init();