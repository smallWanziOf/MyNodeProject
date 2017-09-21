import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {Tabs, Tab , FontIcon , TextField , DatePicker , RaisedButton , Snackbar , DropDownMenu , MenuItem , Checkbox } from 'material-ui';
/**
 * 发表新的HTML文章
 */
export default class AddLog extends Component{
  constructor(prop){
    super(prop);
    this.state={
      articleDate:new Date(),
      staff:[],
      staffValue:'choose',
      secret:false,
      open:false,
      error:''
    }
  }

  componentDidMount(){
    fetch(`${TANGJG.HOST}/method/getStaff`,{
      credentials: 'include',
      method: 'GET',
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=>{return res.json()})
    .then(data=>{
      this.setState({
        staff:data.data,
      })
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handleChangeMinDate = (n,date) => {
    this.setState({
      articleDate:date
    })
  }

  handleStaffChange = (event, index, value) => {
    this.setState({staffValue:value});
  }

  updateCheck = (event,check) => {
    this.setState({
      secret:check
    })
  }

  handleSave = () => {
    if(this.state.staffValue==="choose"){
      this.setState({
        error:'请选择日志创建人',
        open:true,
      });
      return false;
    }
    fetch(`${TANGJG.HOST}/method/submitLog`,{
      credentials: 'include',
      method: 'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        logTime:moment(this.state.articleDate).format("YYYY-MM-DD"),
        creater:this.state.staffValue,
        secret:this.state.secret,
        log:TANGJG.escapeCode(document.getElementById('logDescribe').value)
      })
    })
    .then(res=>{return res.json()})
    .then(data=>{
      if(data.code === "S"){
        document.getElementById('logDescribe').value = '';
        this.setState({
          error:'日志创建成功！坚持每天写日志是一个好习惯哦',
          open:true,
          staffValue:'choose',
          articleDate:new Date(),
          secret:false,
        });
      }else{
        this.setState({
          error:data.msg,
          open:true,
        });
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //提示框关闭
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render(){
    return (
      <div id="AddLog">
        <DatePicker
          onChange={this.handleChangeMinDate}
          floatingLabelText="请选择日期"
          container="inline"
          value={this.state.articleDate}
          className='tang-DatePicker'
        /><br/>
        <DropDownMenu value={this.state.staffValue} autoWidth={false} style={{width:303}} className="tang-DropDownMenu" onChange={this.handleStaffChange}>
          <MenuItem value={'choose'} primaryText="请选择日志创建人" />
          {
            this.state.staff.length>0&&
            this.state.staff.map(item=>{
              return <MenuItem value={item.name} primaryText={item.name} />
            })
          }
        </DropDownMenu>
        <Checkbox
          label="设为隐私日志"
          checked={this.state.secret}
          style={{paddingLeft:24,marginTop:20}}
          onCheck={this.updateCheck}
        />
        <TextField
          style={{width:'95%',left:24}}
          multiLine={true}
          inputStyle={{text:'textarea'}}
          hintText=""
          floatingLabelText="日志描述"
          id="logDescribe"
        /><br />
        <RaisedButton label="保存" primary={true} onClick={this.handleSave} style={{float:'right',marginRight:53}}/>
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
