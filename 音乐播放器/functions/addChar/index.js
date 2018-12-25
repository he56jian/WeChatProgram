// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"test-a0b7ec"
})


const db = cloud.database(),//获取到服务端的数据库
      song_char = db.collection('song_char');   //拿到表集合

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  const data = {
    song_mid:event.song_mid,
    charData:event.charData,      //评论内容
    userInfo:{                    //用户账号
      openId:event.userInfo.openId,
      avatarUrl: event.user.avatarUrl,
      gender: event.user.gender,
      nickName: event.user.nickName,
    },
    time:new Date().getTime()
  };

 try{
   return await song_char.add({
     data
   });
 }catch(e){
   console.log(e);
 }
}