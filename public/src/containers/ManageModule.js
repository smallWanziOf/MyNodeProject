import React,{Component} from "react";
import {Link} from "react-router-dom";
import {TextField,Toggle,RaisedButton,Snackbar,SelectField,MenuItem,FlatButton,Dialog } from 'material-ui';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

export default class ManageModule extends Component{
  constructor(prop){
    super(prop);
    this.state={
      value:null,
      selectOption:[],
      subList:[],
      editOpen:false,
      subNameValue:'',
      subRouterValue:'',
      subDetail:[],
      subID:null,
      parentID:null,
      subLineID:null,
      subItemName:'',
      subItemPath:'',
      changeData:[],
    }
  }

  componentWillMount(){
    fetch(`${TANGJG.HOST}/method/getMenuList`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })    
    .then(res=>res.json())
    .then(json=>{
      this.setState({
        selectOption:json
      })
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handleChange = (event, index, value) => {
    if(index!=null){
      let parentID = this.state.selectOption[index].ID;
      this.setState({value,parentID});
    }
    fetch(`${TANGJG.HOST}/method/getSubList?parent=${value}`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })    
    .then(res=>res.json())
    .then(json=>{
      this.setState({
        subList:json
      })
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  };

  /*点击编辑子元素*/
  editSub = (e) => {
    let value = e.target.parentNode.parentNode.value;
    this.setState({
      editOpen:true,
      subID:value
    });
  }

  /*提交编辑完的子元素*/
  editSubSubmit = () =>{
    fetch(`${TANGJG.HOST}/method/submitSubItem?id=${this.state.subID}`,{
      credentials: 'include',
      method:'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        item:this.state.subItemName,
        subPath:this.state.subItemPath,
        parent:this.state.value
      })
    })    
    .then(res=>res.json())
    .then(json=>{
      this.setState({
        editOpen:false
      })
      this.handleChange(null,null,this.state.value)
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  /*关闭编辑的模态框*/
  handleClose = () => {
    this.setState({editOpen:false})
  }

  /*编辑目录名称和路径*/
  editHandleChange = (f,v) => {
    if(f.target.id == "inputName"){
        this.state.subItemName=v;
    }else{
      this.state.subItemPath=v;
    }
  } 

  /*点击添加一行*/
  addLine = () => {
    let {subList,value} = this.state;
    if(subList.length<10&&value){
      if(!subList[subList.length-1].item){
        return false;
      }
      const newList={
        ID: -1,
        parent: "",
        item: "",
        path: "/"
      };
      this.setState({
        subList:[...subList,newList]
      })
    }
  }

  /*删除选中行*/
  deleteLine = () => {
    fetch(`${TANGJG.HOST}/method/deleteSubLine?id=${this.state.subLineID}`,{
      credentials: 'include',
      method:'post',
      headers: {
        'Content-Type': 'application/json'
      }
    })    
    .then(res=>res.json())
    .then(json=>{
      debugger;
      this.handleChange(null,null,this.state.value)
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  /*删除选中的父元素*/
  deleteParent = () => {
    if(this.state.parentID == null) return false;
    fetch(`${TANGJG.HOST}/method/deleteParent`,{
      credentials: 'include',
      method:'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        parentID:this.state.parentID,
        parentName:this.state.value
      })
    })    
    .then(res=>res.json())
    .then(json=>{
      this.handleChange(null,null,this.state.value)
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  onRowSelection = (a,b,c) => {
    if(a.length>0){
      this.state.subLineID = this.state.subList[a].ID
    }
  }

  render(){
    let {selectOption,subList,editOpen,subNameValue,subRouterValue,subID,value} = this.state;
    return(
      <div id="ManageModule">
        <SelectField
          floatingLabelText="选择管理的父级目录"
          value={value}
          onChange={this.handleChange}
          style={{left:'35%',marginBottom:20}}
         >
          {
            selectOption&&
            selectOption.map((item,i)=>{
              return <MenuItem  key={i} value={item.item} id={`tang-${item.ID}`} primaryText={item.item}/>
            })
          }
        </SelectField>
        <Table onRowSelection={this.onRowSelection}>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>序号</TableHeaderColumn>
              <TableHeaderColumn>子目录名称</TableHeaderColumn>
              <TableHeaderColumn>子目录路径</TableHeaderColumn>
              <TableHeaderColumn>编辑</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody  showRowHover={true}>
            {
              subList&&
              subList.map((item,i)=>{
                return (
                  <TableRow key={i}>
                    <TableRowColumn>{i+1}</TableRowColumn>
                    <TableRowColumn>{item.item}</TableRowColumn>
                    <TableRowColumn>{item.path}</TableRowColumn>
                    <TableRowColumn><FlatButton label="编辑" value={item.ID} primary={true} onClick={e=>{this.editSub(e)}}/></TableRowColumn>
                  </TableRow>
                )
              })
            }

          </TableBody>
        </Table>
        <div className="tang-addmodule-btn">
          <RaisedButton label="添加子目录" primary={true} onClick={this.addLine}/>
          <RaisedButton label="删除子目录" primary={true} onClick={this.deleteLine}/>
          <RaisedButton label="删除父目录" primary={true} onClick={this.deleteParent}/>
        </div>
        {
          subID&&
          <Dialog
            title="编辑子目录"
            open={editOpen}
            defaultValue="Default Value"
            onRequestClose={this.handleClose}
            >
            {
              subList.map((item,i)=>{
                if(item.ID==subID){
                  return (
                    <div key={i}>
                      <TextField
                        id="inputName"
                        hintText={item.item}
                        floatingLabelText="请输入子目录名称"
                        onChange={this.editHandleChange}
                        />
                      <TextField
                        id="inputRouter"
                        hintText={item.path}
                        floatingLabelText="请输入子目录路径"
                        onChange={this.editHandleChange}
                        style={{marginLeft:30}}
                        />
                    </div>
                  )
                }
              })
            }
            <div style={{textAlign:"right"}}>
              <FlatButton label="确定" secondary={true} onClick={this.editSubSubmit}/>
              <FlatButton label="取消" primary={true} onClick={this.handleClose} />
            </div>
          </Dialog>
        }
      </div>
    )
  }
}