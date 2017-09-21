import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DropDownMenu,MenuItem,TextField,RaisedButton,Snackbar,FontIcon,Card,LinearProgress} from "material-ui";
var E = require('wangeditor');
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
      editor:null,
    };
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  componentDidMount(){
    var editor = new E('#editor')
    editor.create();
    this.setState({editor})
  }

  //上传段子
  handleSubmitSatin = () => {
    var value = this.state.editor.txt.html();
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
        content:TANGJG.escapeCode(value),
        time:moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.state.editor.txt.html('');
        this.setState({
          open:true,
          error:'上传成功！原来你也是个段子手,嘿嘿....',
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
        <div id="editor"></div>
        <div>
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
