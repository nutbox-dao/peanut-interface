const formatData = function(money){
  /*将100000转为100,000.000形式*/
  if(money && money!=null){
    money = String(money)
    let left=money.split('.')[0],right=money.split('.')[1];
    right = right ? (right.length>=3 ? '.'+right.substr(0,3) : '.'+right+'0') : '.000'
    let temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
    return (Number(money)<0?"-":"") + temp.join(',').split('').reverse().join('')+right
  }else if(money===0){
    //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
    return '0.000'
  }else{
    return ""
  }
}

export {formatData}
