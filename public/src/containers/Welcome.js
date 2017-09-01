import React,{Component} from "react";
import {Chip,Avatar,FontIcon} from 'material-ui';
export default class Welcome extends Component{
  constructor(prop){
    super(prop);
    this.state={
      dataSource:[],
    }
  }

  componentWillMount(){
    fetch(`${TANGJG.HOST}/method/queryAllSubItem`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })    
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          dataSource:json.data
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //改变旗帜的颜色
  changeFlagColor = () => {
    let r,g,b;
    r = parseInt(Math.random()*256);
    g = parseInt(Math.random()*256);
    b = parseInt(Math.random()*256);
    return `rgb(${r},${g},${b})`;
  }

  //点击快速跳转
  handleTouchTap = (a,b) => {
    this.props.history.push(`${a}`)
  }

  render(){
    return (
      <div>
        <h2>欢迎登陆NodeJS开发的中台管理系统，希望大家积极体验并提出宝贵意见</h2>
        <h4>github地址：<a href="https://github.com/smallWanziOf/MyNodeProject.git">https://github.com/smallWanziOf/MyNodeProject.git</a> 欢迎大家提issue</h4>
        {
          this.state.dataSource.length>0&&
          this.state.dataSource.map((item,i)=>{
            return  <Chip key={i} onClick={this.handleTouchTap.bind(this,item.path)} style={{display:'inline-block',margin:20,cursor:'pointer'}}>
                      <Avatar icon={<FontIcon className="fa fa-flag" style={{color:this.changeFlagColor()}}></FontIcon>}/>
                      {item.item}
                    </Chip>
          })
        }
      </div>
    )
  }
}