import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {Tabs, Tab , FontIcon , TextField , DatePicker , RaisedButton , Snackbar , DropDownMenu , MenuItem , Checkbox } from 'material-ui';

/**
 * 发表新的HTML文章
 */
export default class LogDetail extends Component{
  constructor(prop){
    super(prop);
    this.state={
      dataSource:null,
    }
  }

  componentWillMount(){
    if(this.props.location.state){
      this.setState({
        dataSource:this.props.location.state
      })
    }
  }

  render(){
    let {dataSource} = this.state;
    return (
      dataSource!=null&&
      <div id="AddLog">
        <DatePicker
          floatingLabelText="请选择日期"
          container="inline"
          value={new Date(dataSource.logTime)}
          className='tang-DatePicker'
          disabled = {true}
        /><br/>
        <DropDownMenu value={dataSource.creater} autoWidth={false} style={{width:303}} className="tang-DropDownMenu" disabled = {true}>
          <MenuItem value={dataSource.creater} primaryText={dataSource.creater} />
        </DropDownMenu>
        <Checkbox
          label="设为隐私日志"
          checked={dataSource.secret==="true"?true:false}
          style={{paddingLeft:24,marginTop:20}}
          disabled = {true}
        />
        <TextField
          style={{width:'95%',left:24}}
          multiLine={true}
          inputStyle={{text:'textarea'}}
          value = {dataSource.log}
          disabled = {true}
          floatingLabelText="日志描述"
          id="logDescribe"
        /><br />
        <Link to={{pathname:"/logQuery"}}><RaisedButton label="返回" primary={true} style={{float:'right',marginRight:53}}/></Link>
      </div>
    )
  }
}
