import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DatePicker,DropDownMenu,MenuItem,FlatButton,Checkbox,Snackbar} from "material-ui";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
/**
 * 定时任务模块
 */
export default class StartSchedule extends Component{
  
  constructor(prop){
    super(prop);
    this.state = {
      open:false,
      error:'',
    }
  }

  handleStartSpider = (e) => {
    e.preventDefault();
    fetch(`${TANGJG.HOST}/method/startSpiderText`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })    
    .then(res=>res.json())
    .then(json=>{
      if(json.code === 'S'){
        this.setState({
          open:true,
          error:'执行成功！'
        })
      }else{
        this.setState({
          open:true,
          error:'执行失败！'
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} id="StartSchedule">
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>序号</TableHeaderColumn>
              <TableHeaderColumn>任务名称</TableHeaderColumn>
              <TableHeaderColumn>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>1</TableRowColumn>
              <TableRowColumn>获取百思不得姐文字段子</TableRowColumn>
              <TableRowColumn><a href="" onClick={this.handleStartSpider}>立即执行</a></TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>2</TableRowColumn>
              <TableRowColumn>获取百思不得姐图片段子</TableRowColumn>
              <TableRowColumn><a href="" onClick={this.handleStartSpider}>立即执行</a></TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
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