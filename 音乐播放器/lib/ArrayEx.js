

//打包命名空间参数
Array.prototype.pushNameSpace = function(...arg){
  arg = arg.map(item=>{
    //判断是否为对象
    if(/object/i.test(typeof item)){
      //如果带了命名空间，直接返回
      if(item.nameSpace){
        return {
          nameSpace: item.nameSpace,
          data: item.data
        }
      }else{
        return {
          nameSpace: 'defalt',
          data: item
        }
      }
    }else{
      return {
        nameSpace:'defalt',
        data:item
      }
    }
  });
  this.push(...arg);
}

//查找命名空间
Array.prototype.findNameSpace = function(nameSpace = 'default',subscript){
  
  //查询当前命名空间参数
  const data = this.filter(item=>{
    return new RegExp(nameSpace,'i').test(item.nameSpace)
  }).map(item=>item.data);

  //如果subscript是true时，获取全部
  if(/boolean/i.test(typeof subscript) && subscript){
    return data
  }else{
    //如果没有指定下标，默认取最后一个
    if (subscript === undefined) {
      subscript = data.length - 1;
    }
    return data[subscript];
  }
}

 

export default Array;