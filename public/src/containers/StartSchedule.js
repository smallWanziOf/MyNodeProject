import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DatePicker,DropDownMenu,MenuItem,FlatButton,Checkbox} from "material-ui";
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

    }
  }

  handleStartSpider = (e) => {
    e.preventDefault();
    fetch(`${TANGJG.HOST}/method/startSpider`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })    
    .then(res=>res.json())
    .then(json=>{
      console.log(json)
    })
    .catch(err=>{
      //TANGJG.loginExpires()
    })
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
            <TableRowColumn>1</TableRowColumn>
            <TableRowColumn>获取段子</TableRowColumn>
            <TableRowColumn><a href="" onClick={this.handleStartSpider}>立即执行</a></TableRowColumn>
          </TableBody>
        </Table>
      </div>
    )
  }

}
