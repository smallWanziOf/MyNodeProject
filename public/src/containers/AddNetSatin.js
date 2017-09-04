import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DropDownMenu,MenuItem,TextField,RaisedButton,Snackbar,FontIcon,Card,LinearProgress} from "material-ui";
/**
 * 我是段子手我要添加段子
 */

export default class AddNetSatin extends Component{
  
  constructor(props) {
    super(props);
    this.state = {
      open:false,
      error:'',
      path:'',
      subSuccess:false,
      upProgress:false,
      completed:10,
    };
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  //点击上传图片
  handleUpload = () => {
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
    fetch(`${TANGJG.HOST}/method/fileUpload`,{
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
  handleDeleteUpload = () => {
    fetch(`${TANGJG.HOST}/method/deleteSatinFile`,{
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

  //上传段子
  handleSubmitSatin = () => {
    var value = document.getElementById('article').value;
    if(!value.trim()){
      this.setState({
        open:true,
        error:'空白的段子不好笑,请填写段子内容'
      });
      return false;
    }
    fetch(`${TANGJG.HOST}/method/submitSatin`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        src:this.state.path,
        content:value,
        time:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        document.getElementById('article').value = '';
        this.setState({
          open:true,
          error:'上传成功！原来你也是个段子手,嘿嘿....',
          path:'',
          subSuccess:true,
        },()=>{
          setTimeout(()=>{this.props.history.push('/netSatin')},2000)
        })
      }else{
        this.setState({
          open:true,
          error:'上传失败了',
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  render(){
    return (
      <div id="AddNetSatin">
        <TextField
          style={{width:710}}
          multiLine={true}
          inputStyle={{text:'textarea'}}
          floatingLabelText="输入段子"
          id="article"
          disabled={this.state.subSuccess}
        /><br />
        {
          this.state.upProgress&&<LinearProgress style={{margin:'20px 0'}} mode="determinate" value={this.state.completed} />
        }
        {
          this.state.path&&<img src={'upload/satin/'+this.state.path} width='100px'/>
        }
        <input id="upFile" onChange={this.handleChangeFile} ref="upFile" type='file' accept="image/gif, image/jpeg, image/png" style={{display:'none'}}/>
        <div>
          {
            this.state.path?
            <RaisedButton disabled={this.state.subSuccess} label="图文不符我想删掉" primary={true} onClick={this.handleDeleteUpload}/>
            :
            <RaisedButton disabled={this.state.subSuccess} label="听说段子和图片更配" primary={true} onClick={this.handleUpload}/>
          }
          <RaisedButton disabled={this.state.subSuccess} label="上传段子" secondary={true} onClick={this.handleSubmitSatin}/>
        </div>
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
