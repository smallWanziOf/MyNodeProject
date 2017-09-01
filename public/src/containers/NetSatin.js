import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DropDownMenu,MenuItem,TextField,RaisedButton,Snackbar,FontIcon,Card} from "material-ui";
/**
 * 查讯所有的段子
 */

export default class NetSatin extends Component{
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      comment:[],
      setOver:false,
      satinStar:[],
      satinShit:[],
      error:'',
      open:false,
      page:1,
      noResource:false,
    };
  }

  componentWillMount(){
    this.requestAgainSatin();
  }

  //查询所有的段子
  fetchSubmitComment = () => {

    /*fetch(`${TANGJG.HOST}/method/querySubmitNetSatin`,{
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
      TANGJG.loginExpires()
    })*/
  }

  //点击赞
  handleStar = (a,e) => {
    if(this.state.satinStar.indexOf(a)!=-1){
      this.setState({
        open:true,
        error:'你已经赞过该段子了'
      })
      return false;
    }
    e.target.style.color = "#FF4081";
    fetch(`${TANGJG.HOST}/method/starSatin`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        satinID:a
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        var data = parseInt(document.getElementById(`satin_star_${a}`).attributes['data-value'].value);
        document.getElementById(`satin_star_${a}`).style.color = '#FF4081';
        this.setState({
          open:true,
          error:'点赞成功！',
          satinStar:[...this.state.satinStar,a],
          [`satin_star_${a}`]:data,
        },()=>{
          this.setState({
            [`satin_star_${a}`]:data+1
          })
        });
      }else{
        this.setState({
          open:true,
          error:'点赞失败！',
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //点击踩
  handleShit = (a,e) => {
    if(this.state.satinShit.indexOf(a)!=-1){
      this.setState({
        open:true,
        error:'你已经踩过该段子了'
      })
      return false;
    }
    e.target.style.color = "#FF4081";
    fetch(`${TANGJG.HOST}/method/shitSatin`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        satinID:a
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        var data = parseInt(document.getElementById(`satin_shit_${a}`).attributes['data-value'].value);
        document.getElementById(`satin_shit_${a}`).style.color = '#FF4081';
        this.setState({
          open:true,
          error:'踩踏成功！',
          satinShit:[...this.state.satinShit,a],
          [`satin_shit_${a}`]:data,
        },()=>{
          this.setState({
            [`satin_shit_${a}`]:data+1
          })
        });
      }else{
        this.setState({
          open:true,
          error:'踩踏失败！',
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //点击再来十斤段子
  requestAgainSatin = () => {
    if(this.state.noResource){
      this.setState({
        open:true,
        error:'已经没有资源了！',
      });
      return false;
    }
    fetch(`${TANGJG.HOST}/method/requestAgainSatin?page=${this.state.page}`,{
      credentials: 'include',
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.data.length<10){
        this.setState({
          noResource:true,
        })
      }
      if(json.code === "S"){
        this.setState({
          page:this.state.page+1,
          open:true,
          error:'资源已到！请您慢慢欣赏',
          comment:this.state.comment.concat(json.data),
          setOver:true,
        })
      }else{
        this.setState({
          open:true,
          error:'请求失败！',
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
    let {comment,setOver} = this.state;
    return (
      <div id="NetSatin">
      <Link to='/addNetSatin'><RaisedButton label="我有段子" primary={true} /></Link>
      {
        setOver&&
        comment.length>0?
        comment.map((value,v)=>{
          return (
            <Card zDepth={4} style={{width:750,margin:'50px auto',backgroundColor:'antiquewhite',padding:20}}>
              <div style={{border:'1px solid re'}} className="PrivateChat">
                <div style={{fontSize:16}}>{value.content}</div>
                {
                  value.src&&<div  style={{textAlign:'center'}}><img src={'upload/satin/'+value.src} width='200px'/></div>
                }
                <div style={{textAlign:'center',margin:10,color:'#00BCD4'}}>
                  <FontIcon onClick={this.handleStar.bind(this,value.ID)} style={{cursor:'pointer',color:'#00BCD4'}} className="fa fa-thumbs-o-up"/>
                  <span id={`satin_star_${value.ID}`} data-value={value.star}>({this.state[`satin_star_${value.ID}`]?this.state[`satin_star_${value.ID}`]:value.star})</span>
                  <span style={{margin:20}}></span>
                  <FontIcon onClick={this.handleShit.bind(this,value.ID)} style={{cursor:'pointer',color:'#00BCD4'}} className="fa fa-thumbs-o-down"/>
                  <span id={`satin_shit_${value.ID}`} data-value={value.shit}>({this.state[`satin_shit_${value.ID}`]?this.state[`satin_shit_${value.ID}`]:value.shit})</span>
                </div>
              </div>
            </Card>
          )
        })
        :
        <div style={{textAlign:'center',marginTop:200}}>
          <FontIcon className="fa fa-commenting-o" style={{fontSize:200,color:'rgba(0,0,0,0.1)'}}/>
          <h4 style={{color:'rgba(0,0,0,0.6)'}}>暂无任何段子手添加段子。。。</h4>
        </div>
      }
      {
        comment.length>0&&<div style={{textAlign:'center'}}><RaisedButton label={this.state.noResource?'段子都被你看玩了,快去写吧!':'饿货!再来十斤段子'} primary={true} onClick={this.requestAgainSatin}/></div>
      } 
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
