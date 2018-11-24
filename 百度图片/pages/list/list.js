// pages/list/list.js
let url = 'http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj';

Page({
  /**
   * 页面的初始数据
   * 数据格式、逻辑
   */
  data: {
    word:'猫',  //搜索内容
    page:1,   //加载第几页
    row:30,    //每页加载多少条
    imgs:{      //图片容器
      left:[],
      right:[],
      all:[]
    },
    height:{        //用于判断加在左边还是右边
      left:0, 
      right:0
    }

  },

  /**
   * 生命周期函数--监听页面加载
   * 当前为白屏时刻，
   */
  onLoad: function (options) {
    this.data.word = options.word;
    //使用setData会重新更新渲染页面
    // this.setData({
    //   word: options.word
    // });
   this.showPage();
  },
  
  //请求页面数据
  showPage(){
    //分页加载 
    //page(第几页)
    //num(一页有多少条) 
    this.query()
      .then((data) => {
        let objImg = this.codeData(data.data.data);
        this.showData(objImg);
      })
      .catch((msg) => {
        console.log(msg)
      });
  },
  /** 
   * 请求数据
   * 
  */
  query(){
    let questUrl = this.codeUrl();
    return new Promise((resolve,reject)=>{
      //开始发送请求
      wx.request({
        url: questUrl,
        success: resolve,
        fail:reject
      })
    })
  },

  //获取数据
  codeData(data){
    let codeData = [];    //定义一个空数组，用来存放数据；
    data.forEach((img) => {       //遍历获取到的每个图片
      if (img.objURL) {
        // console.log(this.zoom(img))
        codeData.push(Object.assign({
          middleURL: img.middleURL, //中图
          objURL: img.objURL,       //原图
          thumbURL: img.thumbURL    //小图
        }, this.zoom(img)));
      }
    })
    return codeData;
  },

  //获取等比例缩放宽高；
  zoom(img){
    let zoom = 100 / img.width;
    let height = zoom*img.height;
    return {
      width: 100,
      height
    }
  },
  //数据筛选，把数据放到两边
  showData(data){
    data.forEach((img)=>{
      //如果左边的高，就放右边
      if(this.data.height.left <= this.data.height.right){
        this.data.imgs.left.push(img);
        this.data.height.left += img.height;
      }else {
        this.data.imgs.right.push(img);
        this.data.height.right += img.height;
      }
      this.data.imgs.all.push(img);
    });
    this.setData({
      imgs:this.data.imgs
    })
    
  },
  //保持粒度，一个方法多次调用
  codeUrl(){ 
    //http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&word=%E7%8C%AB&pn=0&rn=10
    //搜索word=%E7%8C%AB为猫，pn为从第几个开始，rn为到哪个结束

    return url = url + 
    '&word=' + this.data.word + 
      '&pn=' + (this.data.page - 1) * this.data.row + 
      '&rn=' + this.data.row;
  },
  //加载更多
  moreData(){
    console.log('加载更多');
    this.data.page++;
    this.showPage();
  },

  //下载图片
  downloadImg(event) {
    let url = event.currentTarget.dataset.src;    //获取需下载的图片的地址；
    wx.downloadFile({
      url,
      success(res){
        //res.tempFilePath为图片的临时路径
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })
      }
    })
  },

  //显示大图
  showImg(event){
    console.log(event)
    let current = event.currentTarget.dataset.src;
    let urls = [...this.data.imgs.all].map(item => { return item.thumbURL});
    console.log(current,urls);
    wx.previewImage({
      urls,
      current,
    });
  }
})