const formatSeconds = function(value){
  //将秒数转换为时分秒格式
  let theTime = parseInt(value)
  let minutes = 0
  let hours = 0

  if(theTime > 60) {
    minutes = parseInt(theTime/60)
    theTime = parseInt(theTime%60)
    if(minutes > 60) {
      hours = parseInt(minutes/60)
      minutes = parseInt(minutes%60)
    }
  }
  // let result = ""
  let result = ""+parseInt(theTime)+"秒"
  if(minutes > 0) {
    result = ""+parseInt(minutes)+"分钟"+result
  }
  if(hours > 0) {
    result = ""+parseInt(hours)+"小时"+result
  }
  return result
}

export {formatSeconds}
