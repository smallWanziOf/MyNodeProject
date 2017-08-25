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

export default class ManageJs extends Component{
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

  //发表文章
  textFieldChange = () => {
    let title = this.getInputContent('title'),
    summary = this.getInputContent('summary'),
    author = this.getInputContent('author'),
    articleDate = moment(this.state.articleDate).format('YYYY-MM-DD'),
    article = this.getInputContent('article');
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
        <TextField
          style={{width:'100%'}}
          multiLine={true}
          inputStyle={{text:'textarea'}}
          hintText=""
          floatingLabelText="文章正文"
          id="article"
        /><br />
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
    this.setState({page},()=>{this.fetchArticle()})
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

  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} className="HistoryArticle">
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>序号</TableHeaderColumn>
              <TableHeaderColumn>标题</TableHeaderColumn>
              <TableHeaderColumn>摘要</TableHeaderColumn>
              <TableHeaderColumn>作者</TableHeaderColumn>
              <TableHeaderColumn>时间</TableHeaderColumn>
              <TableHeaderColumn>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              dataSource.length>0&&
              dataSource.map((item,i)=>{
                return (
                  <TableRow key={i}>
                    <TableRowColumn>{i+1}</TableRowColumn>
                    <TableRowColumn>{item.title}</TableRowColumn>
                    <TableRowColumn>{item.summary}</TableRowColumn>
                    <TableRowColumn>{item.author}</TableRowColumn>
                    <TableRowColumn>{item.articleDate}</TableRowColumn>
                    <TableRowColumn>
                      <Link to={{pathname:"/editJsArticle",state:item.ID}}>编辑</Link>|
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