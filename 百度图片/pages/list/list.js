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
    list:3,
    //图片容器
    imgs:[],
    //每一列高度
    height:[],
    org:[]  //原始数据
  },

  /**
   * 生命周期函数--监听页面加载
   * 当前为白屏时刻，
   */
  onLoad: function (options) {
    this.data.word = options.word || '女孩';
    //使用setData会重新更新渲染页面
    // this.setData({
    //   word: options.word
    // });
    this.createPage();
    this.showPage();
    wx.setNavigationBarTitle({
      title: this.data.word,
    })
  },
  //创建页数
  createPage(){
    //创建空数据
     // this.data.imgs[0].push('Niaho')
    //直接使用push,会导致imgs的所有内容都变为Niaho,是因为填充[]的时候填充的是引用数据，后面push会导致每个都变了
    this.data.imgs = new Array(this.data.list).fill(0).map(()=>[]);
    this.data.height = new Array(this.data.list).fill(0);
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
    //加载请求动画
    wx.showNavigationBarLoading();
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
      this.data.org.push(img);
      // //如果左边的高，就放右边
      // if(this.data.height.left <= this.data.height.right){
      //   this.data.imgs.left.push(img);
      //   this.data.height.left += img.height;
      // }else {
      //   this.data.imgs.right.push(img);
      //   this.data.height.right += img.height;
      // }
      // this.data.imgs.all.push(img);

      //1、从数组中找到最小高度的索引
      //2、根据这个索引找到图片数组push添加图片
      //3、更新高度；
      // let minIndex = this.minList();
      let min = Math.min(...this.data.height);
      let minIndex = this.data.height.findIndex(item=>min === item);    //返回最小高度的索引；当min===item为真时，返回item的索引
      this.data.imgs[minIndex].push(img);
      this.data.height[minIndex]+=img.height;
    });
    this.setData({
      imgs:this.data.imgs
    });

    //加载动画取消
    wx.hideNavigationBarLoading();
  },
  //判断最矮高度
  minList(){
    let minItem = this.data.height[0];   //先设定最小为第一列
    let minIndex = 0;
    this.data.height.forEach((item,index)=>{
      if (minItem >= item){
        minIndex = index;
        minItem = item;
      }
    });
    return minIndex;
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
    let current = event.currentTarget.dataset.src;
    // let urls = [];
    // [this.data.imgs].map(
    //   item => { 
    //     item.map((data)=>{
    //       data.forEach((cItem =>{
    //         urls.push(cItem.middleURL);
    //       }))
    //     })
    //   });
    console.log(this.data.org);
    let urls = this.data.org.map((item) => item.middleURL);
    wx.previewImage({
      urls,
      current,
    });
  }
})