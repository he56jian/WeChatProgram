

export default class Banner{
  //在创建实例化的时候就传入了page对象
  constructor(page){
    Reflect.set(page, "actionBanner",Banner.actionBanner);//监听banner的点击事件
  }

  //跳转方法
  static actionBanner(event){
      const action = event.currentTarget.dataset.action;
    //判断是否为专题
    if(action.atype === 0 ){
      wx.navigateTo({
        url:"/pages/sheet/list?id="+ action.data.id + "&name="+action.data.name
      })
    } else if (action.atype === 1 ){
      wx.navigateTo({
        url: "/pages/search/list?searchVal=" + action.data.name
      })
    }else{
      wx.showToast({
        title: '正在建设~',
        icon:'none'
      })
    }
  }

  getBanner(){
    const data = [];//存储banner图片
    data.push({
      img:
        "http://musicugc.cdn.qianqian.com/ugcdiy/pic/e24e7e173791b889c1f16f4fe5d636cb.jpg",
      atype:0, //专题
      data:{
        id: "108",
        name:'美国公告牌榜'
      }
    });
    data.push({
      img:
        "http://p1.music.126.net/IC9d-lIyM8xCSsE3XREpUg==/109951163720018531.jpg",
      atype: 1, //单曲
      data:{
        name:'光年之外'
      }
    });
    data.push({
      img:"http://p1.music.126.net/6BRWmPQ5g2Pj1bs9AnHhvg==/109951163719197750.jpg",
      atype:2, //其他

    })

    //真正的banner是从后台获取的，所以要有回调，使用promise返回
    return new Promise((resolve,reject)=>{
      resolve(data);
    })

  }

}