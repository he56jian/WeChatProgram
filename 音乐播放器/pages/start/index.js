
import PageModule from "../../lib/Page.js";
import utils from "../../utils/utils.js";
import storage from "../../lib/storage.js";

const $userInfo_db = new storage('userInfo_db');
const $app = getApp().example;
const $page = new PageModule({
  onLoad(){
    // utils.getUserInfo()
    //       .then(res=>{
    //         console.log(res)
    //       });
  },

  getUserInfo(event){
    //获取用户信息
    let userInfo = event.detail.userInfo;
    //保存到全局
    $app.data({
      userInfo: userInfo
    });
    //更新到本地
    if($userInfo_db.where('time','!=','').find()){      //如果查找到userInfo_db数据库中time不为空的数据
      $userInfo_db.where('time','!=','').updata(userInfo);
    }else{
      //如果数据库中没有userInfo_db
      $userInfo_db.add(Object.assign({
        time:new Date().getTime()
      },userInfo))
    }
    $userInfo_db.save();

   //跳转到首页
   wx.redirectTo({
     url: '/pages/index/index',
   })

    
  }
});

$page.init();