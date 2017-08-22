const HOST = "http://127.0.0.1:8081";
function deepCopy(o,s){
  var s = s || [];
  for(var i in o){
    if(typeof o[i] === 'object' && o[i]!=null){
      s[i] = (o[i] instanceof Array) ? []:{};
      deepCopy(o[i],s[i])
    }else{
      s[i] = o[i]
    }
  }
  return s;
}
window.TANGJG={
  HOST,
  deepCopy,
};