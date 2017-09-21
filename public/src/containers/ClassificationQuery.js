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
export default class ClassificationQuery extends Component{
  
  constructor(prop){
    super(prop);
    this.state = {
      dataSource:[],
      page:1,
      total:0,
      articleDate:null,
      staff:[],
      staffValue:'choose',
      secret:false,
    }
  }

  componentWillMount(){
    this.fetchLog();
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

  //查询所有的日志
  fetchLog = () => {
    let {page,staffValue,articleDate} = this.state;
    fetch(`${TANGJG.HOST}/method/queryLog?page=${page}`,{
      credentials: 'include',
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        staffValue:staffValue==="choose"?'':staffValue,
        articleDate:articleDate===null?'':moment(articleDate).format("YYYY-MM-DD"),
      })
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

  //选择日志创建时间
  handleChangeMinDate = (n,date) => {
    this.setState({
      articleDate:date
    })
  }

  //选择日志创建人
  handleStaffChange = (event, index, value) => {
    this.setState({staffValue:value});
  }

  //点击查询按钮
  handleSql = () => {
    let {staffValue,articleDate} = this.state;
    if(articleDate==null&&staffValue==="choose"){
      return false;
    }
    this.setState({
      page:1
    },()=>{this.fetchLog()})
  }

  //点击重置按钮
  handleReset = () => {
    let {staffValue,articleDate} = this.state;
    if(articleDate==null&&staffValue==="choose"){
      return false;
    }
    this.setState({
      staffValue:'choose',
      articleDate:null,
      page:1,
    },()=>{this.fetchLog()})
  }

  //选择阅读模式
  updateCheck = (event,check) => {
    this.setState({
      secret:check
    })
  }

  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} id="LogQuery">
        <div>
          <DropDownMenu value={this.state.staffValue} autoWidth={false} style={{width:303,top:16,left:100}} className="tang-DropDownMenu" onChange={this.handleStaffChange}>
            <MenuItem value={'choose'} primaryText="选择月份" />
            <MenuItem value={'2017-1'} primaryText={'一月份'} />
            <MenuItem value={'2017-2'} primaryText={'二月份'} />
            <MenuItem value={'2017-3'} primaryText={'三月份'} />
            <MenuItem value={'2017-4'} primaryText={'四月份'} />
            <MenuItem value={'2017-5'} primaryText={'五月份'} />
            <MenuItem value={'2017-6'} primaryText={'六月份'} />
            <MenuItem value={'2017-7'} primaryText={'七月份'} />
            <MenuItem value={'2017-8'} primaryText={'八月份'} />
            <MenuItem value={'2017-9'} primaryText={'九月份'} />
            <MenuItem value={'2017-10'} primaryText={'十月份'} />
            <MenuItem value={'2017-11'} primaryText={'十一月份'} />
            <MenuItem value={'2017-12'} primaryText={'十二月份'} />
          </DropDownMenu>
        </div>
        <div className="tang-SqlBtn">
          <RaisedButton label="重置" primary={true} onClick={this.handleReset}/>
          <RaisedButton label="查询" secondary={true} onClick={this.handleSql}/>
        </div>
        <Pagination total={total} current={page} pageSize={10} onChange={this.pageChange}/>
      </div>
    )
  }

}
