import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DatePicker,DropDownMenu,MenuItem,RaisedButton,Checkbox} from "material-ui";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
/**
 * 查询所有的日志
 */
export default class GameRecommend extends Component{
  
  constructor(prop){
    super(prop);
    this.state = {
      dataSource:[],
      page:1,
      total:0,
    }
  }

  componentWillMount(){
    //this.fetchLog();
  }

  //翻页事件
  pageChange = (page,pageSize) => {
    //this.setState({page},()=>{this.fetchLog()})
  }


  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} id="GameRecommend">
        <div>
          <Link to="/createGameRecommend"><RaisedButton label="我要推荐" primary={true}/></Link>
        </div>
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>序号</TableHeaderColumn>
              <TableHeaderColumn>游戏名称</TableHeaderColumn>
              <TableHeaderColumn>推荐时间</TableHeaderColumn>
              <TableHeaderColumn>推荐人</TableHeaderColumn>
              <TableHeaderColumn>游戏点评</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataSource.length>0&&
              dataSource.map((item,i)=>{

              })
            }
          </TableBody>
        </Table>
        <Pagination total={total} current={page} pageSize={10} onChange={this.pageChange}/>
      </div>
    )
  }

}
