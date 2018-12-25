// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function () {
      //openid = >用户 使用你的小程序，小游戏，公众号 =》与开发者账号绑定
      this.getOpenId().then((res) => {
        const openid = res.data.openid,
          session_key = res.data.session_key;
        console.log(openid, session_key);
      });
          
    },

  //获取开发者的openID
  getOpenId(){
    return new Promise((res)=>{
      //获取开发者账号的登录vode
      wx.login({
        success:res
      })
    }).then((res) => {
      const appid = "wx8ea18e46f83e88b9",
        code = res.code,
        appsecret = "f3da01cf9ef148c7a4825ef3b06d94d0",
        //用于请求用户私密信息；
        url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${appsecret}&js_code=${code}&grant_type=authorization_code`;
      return new Promise((res,rej)=>{
        wx.request({
          url: url,
          success:res,
          fail:rej
        })
      })
    });
  },

    //获取用户信息
  bindGetUserInfo(event){
    console.log(event);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})