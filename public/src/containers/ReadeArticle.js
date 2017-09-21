import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {Tabs, Tab , FontIcon , TextField , DatePicker , RaisedButton , Snackbar , Dialog , CircularProgress} from 'material-ui';

/**
 * 发表新的HTML文章
 */
export default class ReadeArticle extends Component{
  
  constructor(prop){
    super(prop);
    this.state={
      articleDate:null,
      error:'',
      open:false,
      title:'',
      summary:'',
      author:'',
      article:'',
      load:false,
      value:null,
      DialogOpen:false,
    }
  }

  componentWillMount(){
    if(this.props.location.state == null) return;
    this.setState({
      value:this.props.location.state
    },()=>{this.queryHtmlArticle()});
  }

  queryHtmlArticle = () => {
    fetch(`${TANGJG.HOST}/method/queryJsAtticleFromId?id=${this.state.value}`,{
      credentials: 'include',
      method:'get',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          title:TANGJG.enEscapeCode(json.data[0].title),
          summary:TANGJG.enEscapeCode(json.data[0].summary),
          author:TANGJG.enEscapeCode(json.data[0].author),
          article:TANGJG.enEscapeCode(json.data[0].article),
          articleDate:json.data[0].articleDate,
          load:true
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  render(){
    let {load,title,summary,author,article,DialogOpen,articleDate} = this.state;
    return (
      <div id="ReadeArticle">
        {
        load&&
          <div>
            <h2 style={{textAlign:'center'}}>{title}</h2>
            <div>作者：{author}</div>
            <div>发表时间：{articleDate}</div>
            <div style={{marginTop:20}} dangerouslySetInnerHTML={{__html:article}}></div>
          </div>
        }
      </div>
    )
  }
}
