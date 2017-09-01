import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {FlatButton,TextField,Snackbar} from "material-ui";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
/**
 * 查询所有的用户
 */
export default class ManageUser extends Component{
  
  constructor(prop){
    super(prop);
    this.state = {
      dataSource:[],
      page:1,
      total:0,
      open:false,
    }
  }

  componentWillMount(){
    this.fetchAllUser();
  }

  //查询所有的用户信息
  fetchAllUser = () => {
    fetch(`${TANGJG.HOST}/method/queryAllUsers?page=${this.state.page}`,{
      credentials: 'include',
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      }
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
    this.setState({page},()=>{this.fetchAllUser()})
  }

  //删除一个用户
  handleDelete = (a,b) => {
    if(!a || !b) return;
    fetch(`${TANGJG.HOST}/method/deleteOldUser`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        userID:a,
        user:b
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          open:true,
          error:'删除成功！'
        },()=>{
          this.fetchAllUser();
        })
      }else{
        this.setState({
          open:true,
          error:'删除失败！'
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //添加一行
  handleAddUser = () => {
    let {dataSource} = this.state;
    if(dataSource.length>0&&dataSource[dataSource.length-1].ID == -1){
      return false;
    }
    const newList={
      ID: -1,
      username: "",
      user:'',
      role: "",
      creater: ""
    };
    this.setState({
      dataSource:[...dataSource,newList]
    })
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  //保存一个新添加的用户
  handleSaveUser = () => {
    let account = document.getElementById('LoginAccount').value,
    user = document.getElementById('staffUserName').value;
    if(!account || !user){
      return false;
    }
    fetch(`${TANGJG.HOST}/method/saveNewLoginUser`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        account:account,
        user:user,
        role:'用户',
        creater:'admin'
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          open:true,
          error:'添加成功！'
        },()=>{
          this.fetchAllUser();
        })
      }else{
        this.setState({
          open:true,
          error:json.msg
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} id="ManageUser">
        <Table selectable={false}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>序号</TableHeaderColumn>
              <TableHeaderColumn>账号</TableHeaderColumn>
              <TableHeaderColumn>使用者</TableHeaderColumn>
              <TableHeaderColumn>角色</TableHeaderColumn>
              <TableHeaderColumn>创建人</TableHeaderColumn>
              <TableHeaderColumn>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover={true}>
            {
              dataSource.length>0&&
              dataSource.map((item,i)=>{
                return  item.ID>0?
                <TableRow>
                  <TableRowColumn>{i+1}</TableRowColumn>
                  <TableRowColumn>{item.username}</TableRowColumn>
                  <TableRowColumn>{item.user}</TableRowColumn>
                  <TableRowColumn>{item.role}</TableRowColumn>
                  <TableRowColumn>{item.creater}</TableRowColumn>
                  <TableRowColumn><a style={{cursor:'pointer'}} onClick={this.handleDelete.bind(this,item.ID,item.username)}>删除</a></TableRowColumn>
                </TableRow>
                :
                <TableRow>
                  <TableRowColumn>{i+1}</TableRowColumn>
                  <TableRowColumn><TextField hintText="输入登录账号" id="LoginAccount"/></TableRowColumn>
                  <TableRowColumn><TextField hintText="输入使用者姓名" id="staffUserName"/></TableRowColumn>
                  <TableRowColumn>用户</TableRowColumn>
                  <TableRowColumn>admin</TableRowColumn>
                  <TableRowColumn><a style={{cursor:'pointer'}} onClick={this.handleSaveUser}>保存</a></TableRowColumn>
                </TableRow>
              })
            }
          </TableBody>
        </Table>
        <div>
          <FlatButton label="添加用户" primary={true} onClick={this.handleAddUser}/>
        </div>
        <Pagination total={total} current={page} pageSize={10} onChange={this.pageChange}/>
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
