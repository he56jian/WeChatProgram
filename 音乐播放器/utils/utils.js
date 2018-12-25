import storage from '../lib/storage.js';

//对象转URL
function objDeUCode(obj){
  if (obj){
    return Object.keys(obj).map(item => {
      return item + '=' + encodeURIComponent(obj[item]);
    }).join("&");
  }
}

//发送一个http的get请求
function httpGet(url,data){
  const db = new storage('http_get');
  const uData = db.where('url', url).find();       //查找url数据；
  let deUrl = url;
  if (data.length){
    deUrl += '?' + objDeUCode(data);   //要请求的URL地址；
  }
  if (uData){
    //如果已经有了缓存
    return new Promise((res)=>{
      res(uData.data)
    })
  }else{
    return new Promise((resolve,reject)=>{
      //如果没有缓存，
      wx.request({
        url: url,
        success: (res) => {
            // 先添加到本地
            db.add({
              data:res.data,
              url,
              time:new Date().getTime()
            }).save();
          resolve(res)            
        },
        fail:reject
      })
    })
    
  }
}
//获取用户信息
function getUserInfo(){
  const $app = getApp().example;    //获取app实例
  return new Promise((resolve,rej)=>{
    let userInfo = $app.data('userInfo');     //储存在全局的用户信息
    //如果本地中存在userInfo，直接返回
    if (userInfo){
      return resolve(userInfo);
    }
    //储存用户信息的数据库
    const userInfo_db = new storage("userInfo_db");
    userInfo = userInfo_db.where('time','!=','').find();      //查找userINfo_db数据库中time不为空的
    if(userInfo){
      //返回之前，设置到全局
      $app.data({userInfo});
      return resolve(userInfo);
    }

    //查询授权信息里的用户信息
      wx.getUserInfo({
        success(res){
          resolve(res.userInfo)
        },
        fail(){
          //跳转到授权页面
          wx.redirectTo({
            url: '/pages/start/index',
          })
        }
      })
  })
}

export default {
  httpGet, objDeUCode,getUserInfo
}