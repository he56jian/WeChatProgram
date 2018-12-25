

import PageModule from "../lib/Page.js";
import { request } from "../common/const.js";

const $Page = new PageModule({
  //用于初始化数据，加载数据，防止多次使用的时候，产生干扰
  onLoad(data){
    Object.assign(this.data,{
      page: 1,//加载第几页
      row:20,//每页多少条数据
      songs:[],
      stock:false   //false表示有数据可以搜索
    });
  },
  // 加载数据
  loadPage(){
    //下拉刷新
    if (this.data.stock) {
      wx.hideNavigationBarLoading();
      return wx.showToast({
        title: '没有更多了！'
      });
    }
    const url = this.data.url + "/p/" + this.data.page + "/r/" + this.data.row;
    wx.showLoading({
      title: '加载音乐项目'
    })
    const res_data = new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: resolve
      })
    });
    res_data.then(this.codePage.bind(this));
  },

  //处理数据
  codePage(res){
    wx.hideLoading();
    wx.hideNavigationBarLoading();
    const data = res.data;
    //更新歌单
    this.data.songs.push(...data.songs);

    //判断页数是否加载完成
    this.data.stock = data.count_page <= this.data.page;
    // console.log(this.data.page, data.count_page)
    this.setData({
      songs: this.data.songs
    });

  },

  //上拉加载更多
  morePage(){
    wx.showNavigationBarLoading();
    this.data.page++;
    this.loadPage();
  }
});

export default $Page;