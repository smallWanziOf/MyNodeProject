import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {Tabs, Tab , FontIcon , TextField , DatePicker , RaisedButton , Snackbar , Dialog , CircularProgress} from 'material-ui';

/**
 * 发表新的HTML文章
 */
export default class EditCssArticle extends Component{
  
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
    fetch(`${TANGJG.HOST}/method/queryCssAtticleFromId?id=${this.state.value}`,{
      method:'get',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.setState({
          title:json.data[0].title,
          summary:json.data[0].summary,
          author:json.data[0].author,
          article:json.data[0].article,
          articleDate:new Date(json.data[0].articleDate),
          load:true
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      console.log(err)
    })
  }

  //日期选择函数
  handleChangeMinDate = (n,date) => {
    this.setState({
      articleDate:date
    })
  }

  //获取输入值的方法
  getInputContent(i){
    return document.getElementById(i).value;
  }

  //清除所有输入框的值
  clearAllfields = () => {
    document.getElementById('title').value='';
    document.getElementById('summary').value='';
    document.getElementById('author').value='';
    document.getElementById('article').value='';
    this.setState({
      articleDate:null,
    })
  }

  //修改文章
  textFieldChange = () => {
    let title = this.getInputContent('title'),
    summary = this.getInputContent('summary'),
    author = this.getInputContent('author'),
    articleDate = moment(this.state.articleDate).format('YYYY-MM-DD'),
    article = this.getInputContent('article'),
    value = this.state.value;
    if(!title || !summary || !author || !article || !articleDate){
      this.setState({
        open:true,
        error:'内容不全，请补充完整后确认修改'
      });
      return false;
    }else{
      fetch(`${TANGJG.HOST}/method/EditCssArticleFromId?id=${value}`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          title:title,
          summary:summary,
          author:author,
          articleDate:articleDate,
          article:article
        })
      })    
      .then(res=>res.json())
      .then(json=>{
        if(json.code == "S"){
          this.setState({
            DialogOpen:true,
          });
          this.clearAllfields();
          setTimeout(()=>{this.props.history.push('/manageCss')},2000)
        }else{
          this.setState({
            open:true,
            error:'修改失败'+json.msg
          });
        }
      })
      .catch(err=>{
        console.log(err)
      })
    }
  }

  //提示框关闭
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render(){
    let {load,title,summary,author,article,DialogOpen} = this.state;
    return (
      <div>
        {
        load&&
          <div>
            <TextField
              hintText=""
              defaultValue={title}
              floatingLabelText="文章标题"
              id="title"
            /><br />
            <TextField
              hintText=""
              defaultValue={summary}
              floatingLabelText="文章摘要"
              id="summary"
            /><br />
            <TextField
              hintText=""
              defaultValue={author}
              floatingLabelText="文章作者"
              id="author"
            /><br />
            <DatePicker
              onChange={this.handleChangeMinDate}
              floatingLabelText="文章日期"
              container="inline"
              value={this.state.articleDate}
            /><br/>
            <TextField
              style={{width:'100%'}}
              multiLine={true}
              inputStyle={{text:'textarea'}}
              hintText=""
              defaultValue={article}
              floatingLabelText="文章正文"
              id="article"
            /><br />
            <div style={{textAlign:'right',margin:'10px 10px 0 0'}}>
              <Link to='/manageHtml'><RaisedButton label="取消" primary={true} onTouchTap={this.textFieldCancle}/></Link>
              <RaisedButton label="确定" secondary={true} onTouchTap={this.textFieldChange} style={{marginLeft:20}}/>
            </div>
            <Snackbar
              open={this.state.open}
              message={this.state.error}
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
            <Dialog
              modal={false}
              open={DialogOpen}
            >
              <div style={{textAlign:'center'}}>
                修改成功,页面跳转中<CircularProgress size={30} style={{top:10,left:10}}/>
              </div>
            </Dialog>
          </div>
        }
      </div>
    )
  }
}
