import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,history} from "react-router-dom";
import moment from "moment";
import {Tabs, Tab , FontIcon , TextField , DatePicker , RaisedButton , Snackbar } from 'material-ui';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
var E = require('wangeditor');


export default class TechnologyBase extends Component{
  constructor(props) {
    super(props);
    this.state = {
      value: 'historyArticle',
    };
  }

  handleChange = (value,t) => {
    this.setState({
      value: value,
    });
    if(t==='trigger'){
      this.refs.getHistoryArticle.fetchArticle();
    }
  };

  render() {
    return (
      <div id="ManageHtml">
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
        >
          <Tab label="历史文章" value="historyArticle" icon={<FontIcon className="material-icons"><i className="fa fa-file-text-o" aria-hidden="true"></i></FontIcon>}>
            <HistoryArticle ref="getHistoryArticle"/>
          </Tab>
          <Tab label="发表文章" value="newArticle" icon={<FontIcon className="material-icons"><i className="fa fa-paper-plane" aria-hidden="true"></i></FontIcon>}>
            <PublishArticle publishSuccess={this.handleChange}/>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

/**
 * 发表新的HTML文章
 */
class PublishArticle extends Component{
  
  constructor(prop){
    super(prop);
    this.state={
      articleDate:null,
      error:'',
      open:false,
      editor:null,
    }
  }

  //日期选择函数
  handleChangeMinDate = (n,date) => {
    this.setState({
      //articleDate:{date:moment(date).format('YYYY-MM-DD')}
      articleDate:date
    })
  }

  //获取输入值的方法
  getInputContent(i){
    return document.getElementById(i).value;
  }

  componentDidMount(){
    var editor = new E('#editor')
    editor.create();
    this.setState({editor})
  }

  //清除所有输入框的值
  clearAllfields = () => {
    document.getElementById('title').value='';
    document.getElementById('summary').value='';
    document.getElementById('author').value='';
    this.state.editor.txt.html('')
    this.setState({
      articleDate:null,
    })
  }

  //发表文章
  textFieldChange = () => {
    let title = TANGJG.escapeCode(this.getInputContent('title')),
    summary = TANGJG.escapeCode(this.getInputContent('summary')),
    author = TANGJG.escapeCode(this.getInputContent('author')),
    articleDate = moment(this.state.articleDate).format('YYYY-MM-DD'),
    article = TANGJG.escapeCode(this.state.editor.txt.html());
    if(!title || !summary || !author || !article || !articleDate){
      this.setState({
        open:true,
        error:'内容不全，请补充完整后发表'
      });
      return false;
    }else{
      fetch(`${TANGJG.HOST}/method/publishJsArticle`,{
        credentials: 'include',
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
            open:true,
            error:'发表成功'
          });
          this.clearAllfields();
          this.props.publishSuccess("historyArticle",'trigger');
        }else{
          this.setState({
            open:true,
            error:'发表失败'+json.msg
          });
        }
      })
      .catch(err=>{
        TANGJG.loginExpires()
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
    return (
      <div>
        <TextField
          hintText=""
          floatingLabelText="文章标题"
          id="title"
        /><br />
        <TextField
          hintText=""
          floatingLabelText="文章摘要"
          id="summary"
        /><br />
        <TextField
          hintText=""
          floatingLabelText="文章作者"
          id="author"
        /><br />
        <DatePicker
          onChange={this.handleChangeMinDate}
          floatingLabelText="文章日期"
          container="inline"
          value={this.state.articleDate}
        /><br/>
        <div  id="editor"></div>
        <div style={{textAlign:'right',margin:'10px 10px 0 0'}}>
          <RaisedButton label="发表" secondary={true} onTouchTap={this.textFieldChange}/>
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

/**
 * 查询所有的文章
 */
class HistoryArticle extends Component{

  constructor(prop){
    super(prop);
    this.state = {
      dataSource:[],
      page:1,
      total:0,
    }
  }

  componentWillMount(){
    this.fetchArticle();
  }

  //查询所有的文章
  fetchArticle = () => {
    let {page} = this.state;
    fetch(`${TANGJG.HOST}/method/queryJsArticle?page=${page}`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      },
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
    this.setState({page},()=>{
      if((document.getElementById('searchContext').value).trim()){
        this.startCheckFetch()
      }else{
        this.fetchArticle()
      }
    })
  }

  //删除一篇文章
  handleDelete = (e) => {
    e.preventDefault();
    let {value} = e.target.attributes[1];
    fetch(`${TANGJG.HOST}/method/deleteJsArticle?id=${value}`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.fetchArticle();
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //点击搜索按钮
  startCheck = () => {
    this.setState({
      page:1
    },()=>{
      this.startCheckFetch()
    })
  }

  //检索所有的文章
  startCheckFetch = () => {
    var data = (document.getElementById('searchContext').value).trim();
    if(data){
      fetch(`${TANGJG.HOST}/method/searchQueryJsArticle`,{
        credentials: 'include',
        method:'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({
          context:data,
          page:this.state.page
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
  }

  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} className="HistoryArticle">
        <TextField
          hintText="请输入检索的内容"
          floatingLabelText="文章检索"
          id="searchContext"
        />
        <RaisedButton style={{marginLeft:20}} label="搜索" primary={true} onClick={this.startCheck}/>
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={{width:'5%'}}>序号</TableHeaderColumn>
              <TableHeaderColumn style={{width:'30%'}}>标题</TableHeaderColumn>
              <TableHeaderColumn style={{width:'30%'}}>摘要</TableHeaderColumn>
              <TableHeaderColumn style={{width:'10%'}}>作者</TableHeaderColumn>
              <TableHeaderColumn style={{width:'10%'}}>时间</TableHeaderColumn>
              <TableHeaderColumn style={{width:'15%'}}>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataSource.length>0&&
              dataSource.map((item,i)=>{
                return (
                  <TableRow key={i}>
                    <TableRowColumn style={{width:'5%'}}>{i+1}</TableRowColumn>
                    <TableRowColumn style={{width:'30%'}}>{item.title}</TableRowColumn>
                    <TableRowColumn style={{width:'30%'}}>{item.summary}</TableRowColumn>
                    <TableRowColumn style={{width:'10%'}}>{item.author}</TableRowColumn>
                    <TableRowColumn style={{width:'10%'}}>{item.articleDate}</TableRowColumn>
                    <TableRowColumn style={{width:'15%'}}>
                      <Link to={{pathname:"/readeArticle",state:item.ID}}>预览</Link>|
                      <Link to={{pathname:"/editTechnologyBase",state:item.ID}}>编辑</Link>|
                      <a href="" onClick={e=>this.handleDelete(e)} data-articleId={item.ID}>删除</a>
                    </TableRowColumn>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
        <Pagination total={total} current={page} pageSize={10} onChange={this.pageChange}/>
      </div>
    )
  }
}