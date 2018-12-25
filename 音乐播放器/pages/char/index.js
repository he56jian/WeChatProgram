import PageModule from "../../lib/Page.js";
import utils from "../../utils/utils.js";




//获取云端的数据库集合
const db = wx.cloud.database();
const song_char = db.collection('song_char');


const $page = new PageModule({
  data:{
    charData:'',
    page:1 ,        //默认第一页，一页20条
    row:8,
    addcharNum:0,       //用于计数
    charList:[]       //用于存放评论列表
  },
  onLoad(song){

    wx.setNavigationBarTitle({
      title: `${song.song_name}`,
    })

    this.setData({song});
    //获取用户信息
    utils.getUserInfo()
      .then(useData => {
        this.data.use = useData
      });

    //获取用户评论
    this.getChar();

  },

  // 设置数据
  setChar(data){
    const datas =data.data;
    datas.forEach(item=>{
      item['time'] =(date=>{
        return `${date.getMonth() + 1}月${date.getDate()}日`
      })(new Date(item['time']))
    })


    const charList =this.data.charList;
    charList.push(...data.data);
    wx.hideNavigationBarLoading();
  
    this.setData({
      charList
    })

  },

  //获取评论列表
  getChar(){
    //显示加载
    wx.showNavigationBarLoading();
    return song_char.where({
              "song_mid":this.data.song.song_mid
            })
            .skip(this.data.page*this.data.row - this.data.row + this.data.addcharNum)          //从哪里开始取数据
            .limit(this.data.row)         //获取多少条
            .orderBy('time','desc')       //根据time倒序
            .get()
            .then(this.setChar.bind(this));
  },
  //滚动加载更多
  moreChar(){
    this.data.page++;
    this.getChar();
  },

  //添加评论
  addchar(event){
    this.setData({
      charData:''
    });
    //输入的评论数据
    const charData = event.detail.value.char;
    
    //如果输入的评论数据为空
    if(!charData.trim()){
     return wx.showToast({
        title: '写点东西吧~ ',
        icon: 'none'
      })
    }
    const data = {
      song_mid: this.data.song.song_mid,
      charData,
      user: this.data.use
    };
    //进行云平台处理添加评论，并发送到云端
    wx.cloud.callFunction({
      name:'addChar',       //执行的函数
      data: data,             //发送过去的数据
      success:(res)=>{
        if(res){
          //立即生效
          data.userInfo = data.user;
          data.time = (date => {
              return `${date.getMonth() + 1}月${date.getDate()}日`
            })(new Date());
      
        
          //把评论添加到数组最前方
          this.data.charList.unshift(data);
          this.setData({charList:this.data.charList})
          this.data.addcharNum++;//序号加1
          wx.showToast({
            title: '添加评论成功 ',
            icon: 'none'
          })
        }
        
      },
      fail(error){
        console.log(error);
        wx.showToast({
          title: '服务端发生错误',
          icon:'none'
        })
      }
    })

  }
})
$page.init();
