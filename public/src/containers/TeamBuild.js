import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText,RaisedButton,FontIcon,Snackbar} from 'material-ui';

/**
 * 发表新的HTML文章
 */
export default class TeamBuild extends Component{
  constructor(prop){
    super(prop);
    this.state={
      page:1,
      dataSource:[],
      noResource:false,
      open:false,
      error:'',
    }
  }

  componentWillMount(){
    this.fetchTeamBuild();
  }

  fetchTeamBuild = () => {
    fetch(`${TANGJG.HOST}/method/queryTeamBuild?page=${this.state.page}`,{
      credentials: 'include',
      method:'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.data.length<3){
        this.setState({
          noResource:true
        })
      }
      if(json.code === "S"){
        this.setState({
          dataSource:this.state.dataSource.concat(json.data)
        })
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //点击加载更多
  handleMore = () => {
    this.setState({
      page:this.state.page+1
    },()=>{
      this.fetchTeamBuild()
    })
  }

  //点击参与
  handleClickJoin = (id) => {
    if(!id){
      return false;
    }
    fetch(`${TANGJG.HOST}/method/joinTeamBuild`,{
      credentials: 'include',
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        teamID:id
      })
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          open:true,
          error:'参与成功！感谢你的支持！'
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

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }

  render(){
    return (
      <div id="TeamBuild">
        <Link to="/createTeamBuild"><RaisedButton label="我要组织" primary={true}/ ></Link>
        {
          this.state.dataSource?
          this.state.dataSource.map((item,i)=>{
            return (
              <Card style={{width:900,margin:'40px auto'}} zDepth={4}>
                <CardHeader
                  title={item.address}
                  subtitle={item.sub_address}
                  avatar={'upload/teamBuild/'+item.src}
                />
                <CardMedia
                  overlay={<CardTitle title={item.src_desc} subtitle={item.src_sub_desc} />}
                >
                  <img src={"upload/teamBuild/"+item.src}/>
                </CardMedia>
                <CardTitle title="发起时间" subtitle={item.time} />
                <CardText>
                  {item.detail_desc}
                </CardText>
                <CardActions>
                  <RaisedButton
                    label="我要参与"
                    primary={true}
                    icon={<FontIcon style={{color:'#FF4081'}} className="fa fa-heart" />}
                    onClick={this.handleClickJoin.bind(this,item.ID)}
                  />
                  <span style={{color:'#aaa'}}>(当前参与：{item.join_num})</span>
                </CardActions>
              </Card>
            )
          })
          :
          <div style={{textAlign:'center',marginTop:200}}>
            <FontIcon className="fa fa-commenting-o" style={{fontSize:200,color:'rgba(0,0,0,0.1)'}}/>
            <h4 style={{color:'rgba(0,0,0,0.6)'}}>目前没有任何团建活动。。。</h4>
          </div>
        }
        <div style={{textAlign:'center'}}>
          <RaisedButton onClick={this.handleMore} label={this.state.noResource?'数据已全部加载':'加载更多'} disabled={this.state.noResource} primary={true}/>
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
