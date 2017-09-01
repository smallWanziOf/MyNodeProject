import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DropDownMenu,MenuItem,TextField,RaisedButton,Snackbar,FontIcon,Card} from "material-ui";
/**
 * 悄悄话收到的互评和建议
 */

export default class PrivateChat extends Component{
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      staff:[],
      staffValue:'',
      department:[],
      departmentValue:'',
      TDYS:'',
      HQ:'',
      JSRWZT:'',
      GZRQ:'',
      ZRG:'',
      JLX:'',
      JQX:'',
      XG:'',
      XQAH:'',
      YBYR:'',
      others:'',
      open:false,
      error:'',
      comment:[],
      setOver:false
    };
  }

  componentWillMount(){
    this.fetchSubmitComment();
    this.fetchChoose();
    this.fetchStaff();
    this.fetchDepartment();
  }

  //查询所有下拉选择的值
  fetchChoose = () =>{
    fetch(`${TANGJG.HOST}/method/queryStaffComment`,{
      credentials: 'include',
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        json.data.map(item=>{
          item.item_choose = item.item_choose.split(';')
        });
        this.setState({
          dataSource:json.data,
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //查询部门员工
  fetchStaff = () =>{
    fetch(`${TANGJG.HOST}/method/getStaff`,{
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
          staff:json.data
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //查询部门
  fetchDepartment = () =>{
    fetch(`${TANGJG.HOST}/method/queryDepartment`,{
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
          department:json.data
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //查询发送给自己的互评
  fetchSubmitComment = () => {
    fetch(`${TANGJG.HOST}/method/querySubmitComment`,{
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
          comment:json.data,
          setOver:true,
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      //TANGJG.loginExpires()
    })
  }

  render(){
    let {dataSource,staff,department,comment,setOver} = this.state;
    return (
      <div id="PrivateChat">
      {
        setOver&&
        comment.length>0?
        comment.map((value,v)=>{
          return (
            <Card zDepth={4} style={{width:750,margin:'0 auto',backgroundColor:'antiquewhite'}}>
              <div style={{marginTop:50,border:'1px solid re'}} className="PrivateChat">
                <div>
                  <strong style={{display:'inline-block',width:150,textAlign:'right'}}>所属部门：</strong>
                  <DropDownMenu value={value.departmentValue} style={{width:'70%',top:23}} autoWidth={false} disabled={true}>
                    {
                      department&&
                      department.map((item,i)=>{
                        return <MenuItem value={item.item_code} primaryText={item.item} key={i}/>
                      })
                    }
                  </DropDownMenu>
                </div>
                <div>
                  <strong style={{display:'inline-block',width:150,textAlign:'right'}}>被评估者姓名：</strong>
                  <DropDownMenu value={value.staffValue} style={{width:'70%',top:23}} autoWidth={false} disabled={true}>
                    {
                      staff&&
                      staff.map((item,i)=>{
                        return <MenuItem value={item.name_code} primaryText={item.name} key={i}/>
                      })
                    }
                  </DropDownMenu>
                </div>
                {
                  dataSource&&
                  dataSource.map((item,i)=>{
                    return  <div key={i}>
                              <strong style={{display:'inline-block',width:150,textAlign:'right'}}>{item.item}：</strong>
                              <DropDownMenu value={value[`${item.item_code}`]} style={{width:'70%',top:23}} autoWidth={false} disabled={true}>
                                {item.item_choose.map((childItem,c)=>{
                                  return <MenuItem value={childItem.slice(0,1)} primaryText={childItem} key={c}/>
                                })}
                              </DropDownMenu>
                            </div>
                  })
                }
                <TextField
                  style={{width:'66%',left:170}}
                  multiLine={true}
                  inputStyle={{text:'textarea'}}
                  value={value.others}
                  disabled={true}
                  floatingLabelText="对被评估者意见或建议："
                  id="article"
                />
              </div>
            </Card>
          )
        })

        :
        <div style={{textAlign:'center',marginTop:200}}>
          <FontIcon className="fa fa-commenting-o" style={{fontSize:200,color:'rgba(0,0,0,0.1)'}}/>
          <h4 style={{color:'rgba(0,0,0,0.6)'}}>您暂未收到任何信息</h4>
        </div>
      } 
      </div>
    )
  }
}
