import React,{Component} from "react";
import { HashRouter , Redirect} from 'react-router-dom';
import {TextField,RaisedButton } from 'material-ui';
import history from 'react-router';

export default class Login extends Component{

  constructor(props){
    super(props);
    this.state={
      canrender:false,
      username:'',
      password:'',
      usernameError:'',
      passwordError:'',
    }
  }

  componentWillMount(){
    if(TANGJG.getCookie('name')){
      this.setState({
        canrender:false
      })
    }else{
      this.setState({
        canrender:true
      })
    }
  }

  componentDidMount(){
    var me = this;
    window.onkeydown = function(e){
      if(e.keyCode === 13){
        if(me.state.username===''){
          me.setState({
            usernameError:'请填写用户名'
          })
          return false;
        }
        if(me.state.password===''){
          me.setState({
            passwordError:'请填写密码'
          })
          return false;
        }
        me.handleLogin();
      }
    }
  }

  componentWillUnMount(){
    window.onkeydown = null;
  }

  handleLogin = () => {
    if(this.state.username===''){
      this.setState({
        usernameError:'请填写用户名'
      })
      return false;
    }
    if(this.state.password===''){
      this.setState({
        passwordError:'请填写密码'
      })
      return false;
    }
    fetch(`${TANGJG.HOST}/method/login`,{
      credentials: 'include',
      method:'post',
      headers: {
          'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        username:this.state.username,
        password:this.state.password
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === 'S'){
        TANGJG.login({name:json.msg});
      }else if(json.code === 'U'){
        this.setState({
          usernameError:json.msg
        })
      }else if(json.code === "P"){
        this.setState({
          passwordError:json.msg
        })
      }else{
        this.setState({
          usernameError:json.msg,
          passwordError:json.msg
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handleName = (f,v) => {
    this.setState({
      username:v,
      usernameError:''
    })
  }

  handlePwd = (f,v) => {
    this.setState({
      password:v,
      passwordError:'',
    })
  }

  render(){
    return (
      <div id="Login">
        {
          this.state.canrender?
          <div>
            <div className="login">
              <div></div>
              <TextField
                hintText="Username"
                floatingLabelText="用户名"
                type="text"
                id="username"
                onChange={this.handleName}
                errorText={this.state.usernameError}
              /><br />
              <TextField
                hintText="Password"
                floatingLabelText="密码"
                type="password"
                id="password"
                onChange={this.handlePwd}
                errorText={this.state.passwordError}
              /><br />
              <RaisedButton label="登录" primary={true} onClick={this.handleLogin} style={{marginTop:20}}/>
            </div>
          </div>
          :
          ''
        }
      </div>
    )
  }
}