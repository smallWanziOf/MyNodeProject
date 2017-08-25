import React,{Component} from "react";
import {Link} from "react-router-dom";
import {TextField,Toggle,RaisedButton,Snackbar} from 'material-ui';

export default class AddModule extends Component{
  constructor(props){
    super(props);
    this.state={
      subDisabled:false,
      mainModuleValue:'',
      subModuleValue:'',
      subModulePath:'',
      open:false,
      errorContent:''
    }
  }

  //主模块值改变事件
  mainModule = (event,value) => {
    this.setState({
      mainModuleValue:value
    })
  }

  //子模块值改变事件
  subModule = (event,value) => {
    this.setState({
      subModuleValue:value
    })
  }

  //子模块链接地址
  subModulePath = (event,value) => {
    this.setState({
      subModulePath:value
    })
  }

  //点击添加子目录
  handleToggle = (event,check) => {
    this.setState({
      subDisabled:check,
    })
  }

  //点击取消按钮情况所有值
  handleCancle = () => {
    this.setState({
      mainModuleValue:'',
      subModuleValue:'',
      subModulePath:'',
      subDisabled:false
    })
  }

  //点击确认提交
  handleSubmit = () => {
    let {mainModuleValue,subDisabled,subModuleValue,subModulePath} = this.state;
    let error = '';
    if(!mainModuleValue){
      error+="模块名称不能为空 "
    }
      if(!subModuleValue){
        error+="子模块名称不能为空 "
      }
      if(!subModulePath){
        error+="子模块链接地址不能为空"
      }
    if(error){
      this.setState({
        open:true,
        errorContent:error
      });
      return false;
    }else{
      this.fetch()
    }
  }

  //取消错误消息提示
  handleRequestClose = () => {
    this.setState({
      open:false
    })
  }

  //提交所有数据
  fetch = () => {
    let {mainModuleValue,subDisabled,subModuleValue,subModulePath} = this.state;
    fetch(`${TANGJG.HOST}/method/addModule`,{
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        menu:mainModuleValue,
        child:subDisabled,
        sub:subDisabled?subModuleValue:'',
        path:subDisabled?subModulePath:'',
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code=="S"){
        window.location.reload()
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  render(){
    let {subDisabled,mainModuleValue,subModuleValue,open,errorContent,subModulePath} = this.state;
    return (
      <div id="AddModule">
        <div className="tang-addmodule-form">
          <div>
            <span>模块名称：</span><TextField value={mainModuleValue} hintText="输入主模块的名称" onChange={this.mainModule}/>
          </div>
          <div>
            <span>添加子模块：</span><Toggle toggled={subDisabled} onToggle={this.handleToggle} style={{display:"inline-block",width:"auto"}}/>
          </div>
          <div>
            <span>子模块名称：</span><TextField value={subModuleValue} disabled={!subDisabled} hintText="输入子目录的名称" onChange={this.subModule}/>
          </div>
          <div>
            <span>链接地址：</span><TextField value={subModulePath} disabled={!subDisabled} hintText="输入链接地址" onChange={this.subModulePath}/>
          </div>
        </div>
        <div className="tang-addmodule-btn">
          <RaisedButton primary={true} label="取消" onClick={this.handleCancle}/>
          <RaisedButton secondary={true} label="确定" onClick={this.handleSubmit}/>
        </div>
        <Snackbar
          open={open}
          message={errorContent}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}