const timeFormat = function(timestamp){
  // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
  let date = new Date(timestamp * 1000)
  let Y = date.getFullYear() + '-'
  let  M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  let D = date.getDate() + ' '
  let h = date.getHours() + ':'
  let m = date.getMinutes() + ':'
  let s = date.getSeconds()
  return Y+M+D+h+m+s
}

export {timeFormat}
