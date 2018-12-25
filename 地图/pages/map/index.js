// pages/map/index.js
Page({
  data:{

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    wx.getLocation({
      "type": "gcj02",
      success: (res)=> {
        let longitude = res.longitude,
            latitude = res.latitude;
        this.setData({
          longitude,
          latitude,
          markers:[
            {
              longitude,
              latitude,
            }
          ]
        })
      },
    })
  },

})