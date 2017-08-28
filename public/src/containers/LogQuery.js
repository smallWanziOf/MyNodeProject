import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
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
export default class LogQuery extends Component{
  
  constructor(prop){
    super(prop);
    this.state = {
      dataSource:[],
      page:1,
      total:0,
    }
  }

  componentWillMount(){
    this.fetchLog();
  }

  //查询所有的日志
  fetchLog = () => {
    let {page} = this.state;
    fetch(`${TANGJG.HOST}/method/queryLog?page=${page}`,{
      credentials: 'include',
      method:'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          dataSource:json.data,
          total:json.total
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //翻页事件
  pageChange = (page,pageSize) => {
    this.setState({page},()=>{this.fetchLog()})
  }

  //删除一篇文章
  handleDelete = (e) => {
    e.preventDefault();
    let {value} = e.target.attributes[1];
    fetch(`${TANGJG.HOST}/method/deleteLog?id=${value}`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.fetchLog();
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} id="LogQuery">
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>序号</TableHeaderColumn>
              <TableHeaderColumn>创建时间</TableHeaderColumn>
              <TableHeaderColumn>创建人</TableHeaderColumn>
              <TableHeaderColumn>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataSource.length>0&&
              dataSource.map((item,i)=>{
                return (
                  <TableRow key={i}>
                    <TableRowColumn>{i+1}</TableRowColumn>
                    <TableRowColumn>{item.logTime}</TableRowColumn>
                    <TableRowColumn>{item.creater}</TableRowColumn>
                    <TableRowColumn>
                      <Link to={{pathname:"/logDetail",state:item.ID}}>详情</Link>|
                      <a href="" onClick={e=>this.handleDelete(e)} data-articleId={item.ID}>删除</a>
                    </TableRowColumn>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <Pagination total={total} current={page} pageSize={10} onChange={this.pageChange}/>
      </div>
    )
  }

}
