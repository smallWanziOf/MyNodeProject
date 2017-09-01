import React,{Component} from "react";
import { HashRouter , Redirect} from 'react-router-dom';
import {TextField,RaisedButton,Snackbar} from 'material-ui';
import history from 'react-router';

export default class ChangePassword extends Component{

  constructor(props){
    super(props);
    this.state={
      username:'',
      oldPassword:'',
      usernameError:'',
      oldPasswordError:'',
      newPassword:'',
      newPasswordError:'',
      reNewPassword:'',
      reNewPasswordError:'',
      open:false,
      errorMsg:'',
      changeSuccess:false,
    }
  }

  //查询登录者的个人信息
  componentWillMount(){
    fetch(`${TANGJG.HOST}/method/getUserBaseInfo`,{
      credentials: 'include',
      method:'get',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          username:json.data
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handleChange = () => {
    if(!(this.state.oldPassword).trim() || !(this.state.newPassword).trim() || !(this.state.reNewPassword).trim()){
      this.setState({
        open:true,
        errorMsg:'密码不能为空'
      })
      return false;
    }
    if((this.state.newPassword).trim()!==(this.state.reNewPassword).trim()){
      this.setState({
        reNewPasswordError:'两次输入的密码不一致,请重新输入'
      });
      return false;
    }
    fetch(`${TANGJG.HOST}/method/changePassword`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        username:this.state.username,
        oldPassword:this.state.oldPassword,
        newPassword:this.state.newPassword
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          open:true,
          errorMsg:'密码修改成功！请重新登录',
          changeSuccess:true
        },()=>{setTimeout(()=>{TANGJG.loginExpires()},2000)})
      }else{
        this.setState({
          oldPasswordError:json.msg
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handlePwd = (f,v) => {
    this.setState({
      oldPassword:v,
      oldPasswordError:'',
    })
  }

  handleNewPwd = (f,v) => {
    this.setState({
      newPassword:v,
      newPasswordError:'',
    })
  }
  
  handleReNewPwd = (f,v) => {
    this.setState({
      reNewPassword:v,
      reNewPasswordError:'',
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render(){
    return (
      <div id="ChangePassword">
        <div>
          <div className="login">
            <div></div>
            <TextField
              hintText="Username"
              floatingLabelText="用户名"
              type="text"
              value={this.state.username}
              id="username"
              disabled={true}
            /><br />
            <TextField
              hintText="Password"
              floatingLabelText="旧密码"
              type="password"
              id="oldPassword"
              onChange={this.handlePwd}
              errorText={this.state.oldPasswordError}
            /><br />
             <TextField
              hintText="Password"
              floatingLabelText="新密码"
              type="password"
              id="newPassword"
              onChange={this.handleNewPwd}
              errorText={this.state.newPasswordError}
            /><br />
            <TextField
              hintText="Password"
              floatingLabelText="确认密码"
              type="password"
              id="reNewPassword"
              onChange={this.handleReNewPwd}
              errorText={this.state.reNewPasswordError}
            /><br />
            <RaisedButton disabled={this.state.changeSuccess} label="确认修改" primary={true} onClick={this.handleChange} style={{marginTop:20}}/>
          </div>
        </div>
        <Snackbar
          open={this.state.open}
          message={this.state.errorMsg}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}