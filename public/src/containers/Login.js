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


  handleLogin = () => {
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
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handleName = (f,v) => {
    this.setState({
      username:v
    })
  }

  handlePwd = (f,v) => {
    this.setState({
      password:v
    })
  }

  render(){
    return (
      <div id="Login">
        {
          this.state.canrender?
          <div>
            <div className='cloud'>
            </div>
            <div className="login">
              <div></div>
              <TextField
                hintText="Username"
                floatingLabelText="用户名"
                type="text"
                id="username"
                onChange={this.handleName}
              /><br />
              <TextField
                hintText="Password"
                floatingLabelText="密码"
                type="password"
                id="password"
                onChange={this.handlePwd}
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