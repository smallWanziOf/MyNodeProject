import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DropDownMenu,MenuItem,TextField,RaisedButton,Snackbar} from "material-ui";
/**
 * 员工互评界面
 */
const styles = {
  customWidth: {
    width: 200,
  },
};
export default class StaffComment extends Component{
  
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
    };
  }

  componentWillMount(){
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

  //设置选中的值
  handleChange(code,event, index, value){
    this.setState({
      [code]:value
    })
  };

  //提交员工互评
  handleSubmit = () => {
    if(this.state.staffValue==''||this.state.departmentValue==''){
      this.setState({
        open:true,
        error:'所属部门和被评估者姓名不能为空'
      })
      return false;
    }
    fetch(`${TANGJG.HOST}/method/submitStaffComment`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        TDYS:this.state.TDYS,
        HQ:this.state.HQ,
        JSRWZT:this.state.JSRWZT,
        GZRQ:this.state.GZRQ,
        ZRG:this.state.ZRG,
        JLX:this.state.JLX,
        JQX:this.state.JQX,
        XG:this.state.XG,
        XQAH:this.state.XQAH,
        YBYR:this.state.YBYR,
        staffValue:this.state.staffValue,
        departmentValue:this.state.departmentValue,
        others:document.getElementById('article').value
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        document.getElementById('article').value = '';
        this.setState({
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
          staffValue:'',
          departmentValue:'',
          others:'',
          open:true,
          error:'互评成功！感谢您的参与'
        })
      }else{
        console.log(json.msg)
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
  };

  render(){
    let {dataSource,staff,department} = this.state;
    return (
      <div style={{marginTop:50}} id="StaffComment">
        <div>
          <strong style={{display:'inline-block',width:150,textAlign:'right'}}>所属部门：</strong>
          <DropDownMenu value={this.state.departmentValue} style={{width:'70%',top:23}} autoWidth={false} onChange={this.handleChange.bind(this,'departmentValue')}>
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
          <DropDownMenu value={this.state.staffValue} style={{width:'70%',top:23}} autoWidth={false} onChange={this.handleChange.bind(this,'staffValue')}>
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
                      <DropDownMenu value={this.state[`${item.item_code}`]} style={{width:'70%',top:23}} autoWidth={false} onChange={this.handleChange.bind(this,item.item_code)}>
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
          hintText=""
          floatingLabelText="对被评估者意见或建议："
          id="article"
        />
        <h5 style={{marginLeft:167}}>(提示：本表填写不记名，不强制填写，如大家填写请保证公平公正)</h5>
        <div style={{textAlign:'center'}}>
          <RaisedButton label="提交" primary={true} onClick={this.handleSubmit}/>
        </div>
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
