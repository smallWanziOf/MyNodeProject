import Cookie from 'js-cookie';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

!function(){
  const HOST = "http://192.168.10.32:8081";
  //const HOST = "http://192.168.9.120:8081";
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
  function login(props){
    var date = new Date(Date.now() + 20*60*1000);
    let {name} = props;
    Cookie.set('name',name,{expires:date})
    history.push('/');
    window.location.reload();
  }
  function logout(){
    Cookie.remove('name');
    history.push("/login");
    window.location.reload();
  }
  function getCookie(c){
    return Cookie.get(c)
  }
  function loginExpires(){
    if(history.location.pathname!='/login'){
      history.push("/login");
      Cookie.remove('name');
      window.location.reload();
      return false;
    }
  }
  window.TANGJG={
    HOST,
    deepCopy,
    login,
    logout,
    getCookie,
    loginExpires,
  };
}()