import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {Divider,Paper,TextField,RaisedButton,DatePicker,LinearProgress,Snackbar} from 'material-ui';

const style = {
  width:'100%',
};

/**
 * 组织新的团建活动
 */
export default class CreateTeamBuild extends Component{
  constructor(prop){
    super(prop);
    this.state={
      articleDate:new Date(),
      path:'',
      upProgress:false,
      completed:10,
      open:false,
      error:'',
      subSuccess:false,
    }
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  handleChangeMinDate = (n,date) => {
    this.setState({
      articleDate:date
    })
  }

  /**
   * 图片相关操作
   */

  //点击上传图片
  handleUpLoad = () => {
    this.refs.upFile.click(); 
  }

  //选中上传的图片
  handleChangeFile = () => {
    this.setState({
      upProgress:true,
    })
    var timer = setInterval(()=>{
      if(this.state.completed<90){
        let completed = this.state.completed + 10;
        this.setState({completed})
      }else{
        clearInterval(timer);
        timer = null;
      }
    },500)
    var value = document.getElementById('upFile');
    var data = new FormData();
    data.append('file', value.files[0]);
    data.append('user', 'hubot');
    fetch(`${TANGJG.HOST}/method/upLoadTeamPicture`,{
      credentials: 'include',
      method: 'POST',
      body: data
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          open:true,
          error:'上传成功',
          path:json.path,
          completed:100,
          upProgress:false
        })
      }else{
        this.setState({
          open:true,
          error:'上传失败',
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //点击我想删掉上传的图片
  handleDeleteUpLoad = () => {
    fetch(`${TANGJG.HOST}/method/deleteTeamFile`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        src:this.state.path
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          open:true,
          error:'删除成功',
          path:'',
        })
      }else{
        this.setState({
          open:true,
          error:'删除失败',
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //点击提交此次的活动
  handleSubmit =  () => {
    var teamAddress = (document.getElementById('team-address').value).trim(),
        teamSubAddress = (document.getElementById('team-sub-address').value).trim(),
        teamPictureDesc = (document.getElementById('team-picture-desc').value).trim(),
        teamPictureSubDesc = (document.getElementById('team-picture-sub-desc').value).trim(),
        teamReason = (document.getElementById('team-reason').value).trim();
    if(!teamAddress||!teamSubAddress||!teamPictureDesc||!teamPictureSubDesc||!teamReason||!this.state.path||!this.state.articleDate){
      this.setState({
        open:true,
        error:'所有内容均为必填字段，请对此次活动负责！'
      });
      return false;
    }
    fetch(`${TANGJG.HOST}/method/submitTeamBuild`,{
      credentials: 'include',
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        teamAddress:teamAddress,
        teamSubAddress:teamSubAddress,
        teamPictureDesc:teamPictureDesc,
        teamPictureSubDesc:teamPictureSubDesc,
        teamReason:teamReason,
        path:this.state.path,
        time:moment(this.state.articleDate).format("YYYY-MM-DD HH:mm:ss")
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          open:true,
          error:'活动组织成功！',
          subSuccess:true,
        })
        setTimeout(() => {
          this.props.history.push('/teamBuild');  
        }, 2000);
      }else{
        this.setState({
          open:true,
          error:'组织失败',
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  render(){
    return (
      <div id="CreateTeamBuild">
        <input id="upFile" onChange={this.handleChangeFile} ref="upFile" type='file' accept="image/gif, image/jpeg, image/png" style={{display:'none'}}/>
        <Paper zDepth={2} style={{width:1000,padding:20}}>
          <TextField hintText="输入团建的概要地点" style={style} underlineShow={false} id="team-address" disabled={this.state.subSuccess}/>
          <Divider />
          <TextField hintText="输入团建的详细地点" style={style} underlineShow={false} id="team-sub-address" disabled={this.state.subSuccess}/>
          <Divider />
          {
            this.state.path?
            <RaisedButton onClick={this.handleDeleteUpLoad} style={{margin:'10px 0'}} label="删除图片" primary={true} disabled={this.state.subSuccess}/>
            :
            <RaisedButton onClick={this.handleUpLoad} style={{margin:'10px 0'}} label="上传图片" primary={true} disabled={this.state.subSuccess}/>
          }
          {
            this.state.upProgress&&<LinearProgress style={{margin:'20px 0'}} mode="determinate" value={this.state.completed} />
          }
          {
            this.state.path&&<div>
              <Divider />
              <img src={'upload/teamBuild/'+this.state.path} style={{maxWidth:500,display:'inline-block',margin:'10px 0'}}/>
            </div>
          }
          <Divider />
          <TextField hintText="输入对上传图片的概要描述" style={style} underlineShow={false} id="team-picture-desc" disabled={this.state.subSuccess}/>
          <Divider />
          <TextField hintText="输入对上传图片的详细描述" style={style} underlineShow={false} id="team-picture-sub-desc" disabled={this.state.subSuccess}/>
          <Divider />
          <DatePicker
            onChange={this.handleChangeMinDate}
            floatingLabelText="请选择日期"
            container="inline"
            value={this.state.articleDate}
            disabled={this.state.subSuccess}
          />
          <Divider />
          <TextField hintText="输入组织此次活动的原因" style={style} underlineShow={false} id="team-reason" disabled={this.state.subSuccess}/>
          <Divider />
          <div style={{textAlign:'right'}}>
            <RaisedButton onClick={()=>{this.props.history.push('/teamBuild')}} style={{margin:'10px 20px'}} label="取消" secondary={true} disabled={this.state.subSuccess}/>
            <RaisedButton onClick={this.handleSubmit} style={{margin:'10px 0'}} label="确定发起" primary={true} disabled={this.state.subSuccess}/>
          </div>
        </Paper>
        <Snackbar
          open={this.state.open}
          message={this.state.error}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}
