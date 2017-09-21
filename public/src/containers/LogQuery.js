import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import ReactEcharts from 'echarts-for-react'; 
import moment from "moment"; 
import {DatePicker,DropDownMenu,MenuItem,RaisedButton,Checkbox} from "material-ui";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
/**
 * 查询所有的日志
 */
export default class LogQuery extends Component{
  constructor(prop){
    super(prop);
    this.state = {
      dataSource:[],
      page:1,
      total:0,
      articleDate:null,
      staff:[],
      staffValue:'choose',
      secret:false,
      monthShow:false,
      monthValue:'choose', 
      monthFormat:'',
    }
  }

  componentWillMount(){
    this.fetchLog();
  }

  componentDidMount(){
    fetch(`${TANGJG.HOST}/method/getStaff`,{
      credentials: 'include',
      method: 'GET',
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=>{return res.json()})
    .then(data=>{
      this.setState({
        staff:data.data,
      })
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //查询所有的日志
  fetchLog = () => {
    let {page,staffValue,articleDate} = this.state;
    fetch(`${TANGJG.HOST}/method/queryLog?page=${page}`,{
      credentials: 'include',
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        staffValue:staffValue==="choose"?'':staffValue,
        articleDate:articleDate===null?'':moment(articleDate).format("YYYY-MM-DD"),
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

  //翻页事件
  pageChange = (page,pageSize) => {
    this.setState({page},()=>{this.fetchLog()})
  }

  //删除一篇文章
  handleDelete = (e) => {
    e.preventDefault();
    let {value} = e.target.attributes[1];
    fetch(`${TANGJG.HOST}/method/deleteLog?id=${value}`,{
      credentials: 'include',
      method:'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res=>res.json())
    .then(json=>{
      if(json.code === "S"){
        this.fetchLog();
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  //选择日志创建时间
  handleChangeMinDate = (n,date) => {
    this.setState({
      articleDate:date
    })
  }

  //选择日志创建人
  handleStaffChange = (event, index, value) => {
    this.setState({staffValue:value});
  }

  //选择按月底查询的月份
  handleMonthChange = (event ,index ,value) => {
    var date = new Date().getFullYear();
    this.setState({
      monthValue:value,
      monthFormat:date+value
    });
  }
  //点击查询按钮
  handleSql = () => {
    let {staffValue,articleDate} = this.state;
    if(articleDate==null&&staffValue==="choose"){
      return false;
    }
    this.setState({
      page:1
    },()=>{this.fetchLog()})
  }

  //点击重置按钮
  handleReset = () => {
    let {staffValue,articleDate} = this.state;
    if(articleDate==null&&staffValue==="choose"){
      return false;
    }
    this.setState({
      staffValue:'choose',
      articleDate:null,
      page:1,
    },()=>{this.fetchLog()})
  }

  //选择阅读模式
  updateCheck = (event,check) => {
    this.setState({
      secret:check
    })
  }

  //选择按月度显示
  updateCheckMouth = (event,check) => {
    this.setState({
      monthShow:check
    }) 
  }

  render(){
    let {dataSource,total,page} = this.state;
    return (
      <div style={{marginTop:50}} id="LogQuery">
        <div>
          <DatePicker
            onChange={this.handleChangeMinDate}
            floatingLabelText="请选择日期"
            container="inline"
            value={this.state.articleDate}
            className='tang-DatePicker'
          />
          <DropDownMenu value={this.state.staffValue} autoWidth={false} style={{width:303,top:16,left:100}} className="tang-DropDownMenu" onChange={this.handleStaffChange}>
            <MenuItem value={'choose'} primaryText="请选择日志创建人" />
            {
              this.state.staff.length>0&&
              this.state.staff.map(item=>{
                return <MenuItem value={item.name} primaryText={item.name} />
              })
            }
          </DropDownMenu>
          <Checkbox
            label="阅读模式"
            checked={this.state.secret}
            onCheck={this.updateCheck}
            style={{display:"inline-block",width:150,left:200}}
            className="tang-Checkbox"
          />
          <Checkbox
            label="按月显示"
            checked={this.state.monthShow}
            onCheck={this.updateCheckMouth}
            style={{display:"inline-block",width:150,left:200}}
            className="tang-Checkbox"
          />
          <DropDownMenu value={this.state.monthValue} autoWidth={false} style={{width:303,top:16,left:200,display:this.state.monthShow?'inline-block':'none'}} className="tang-DropDownMenu" onChange={this.handleMonthChange}>
            <MenuItem value={'choose'} primaryText="选择月份" />
            <MenuItem value={'-01'} primaryText={'一月份'} />
            <MenuItem value={'-02'} primaryText={'二月份'} />
            <MenuItem value={'-03'} primaryText={'三月份'} />
            <MenuItem value={'-04'} primaryText={'四月份'} />
            <MenuItem value={'-05'} primaryText={'五月份'} />
            <MenuItem value={'-06'} primaryText={'六月份'} />
            <MenuItem value={'-07'} primaryText={'七月份'} />
            <MenuItem value={'-08'} primaryText={'八月份'} />
            <MenuItem value={'-09'} primaryText={'九月份'} />
            <MenuItem value={'-10'} primaryText={'十月份'} />
            <MenuItem value={'-11'} primaryText={'十一月份'} />
            <MenuItem value={'-12'} primaryText={'十二月份'} />
          </DropDownMenu>
        </div>
        <div className="tang-SqlBtn">
          <RaisedButton label="重置" primary={true} onClick={this.handleReset}/>
          <RaisedButton label="查询" secondary={true} onClick={this.handleSql}/>
        </div>
        {
          this.state.monthShow?
          <Demo value={this.state.monthFormat}/>
          :
          this.state.secret?
          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>内容</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {
                dataSource.length>0&&
                dataSource.map((item,i)=>{
                  return (
                    <TableRow key={i}>
                      <TableRowColumn>
                        <p>创建时间：{item.logTime}</p>
                        <p>创建人：{item.creater}</p>
                        <pre dangerouslySetInnerHTML={{__html:item.log}}></pre>
                      </TableRowColumn>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
          :
          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>序号</TableHeaderColumn>
                <TableHeaderColumn>创建时间</TableHeaderColumn>
                <TableHeaderColumn>创建人</TableHeaderColumn>
                <TableHeaderColumn>操作</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {
                dataSource.length>0&&
                dataSource.map((item,i)=>{
                  return (
                    <TableRow key={i}>
                      <TableRowColumn>{i+1}</TableRowColumn>
                      <TableRowColumn>{item.logTime}</TableRowColumn>
                      <TableRowColumn>{item.creater}</TableRowColumn>
                      <TableRowColumn>
                        <Link to={{pathname:"/logDetail",state:item}}>详情</Link>|
                        <a href="" onClick={e=>this.handleDelete(e)} data-articleId={item.ID}>删除</a>
                      </TableRowColumn>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        }
        {
          this.state.monthShow?'':<Pagination total={total} current={page} pageSize={10} onChange={this.pageChange}/>
        }
      </div>
    )
  }

}

class Demo extends Component{
  constructor(props){
    super(props);
    this.state={
      option:false,
      optionData:null,
    }
  }

  componentWillMount(){
    this.handleFetch();
  }

  componentWillReceiveProps(props){
    this.setState({
      option:true,
      optionData:null
    },()=>{
      this.handleFetch(props.value)
    })
  }

  handleFetch = (value) =>{
    fetch(`${TANGJG.HOST}/method/monthQueryLog?value=${value}`,{
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
          option:true,
          optionData:json.data
        })
      }else{
        console.log(json.msg)
      }
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  getOption(){
    return {
      title : {
          text: '月份日志统计图',
          x:'center'
      },
      tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            crossStyle: {
                color: '#999'
            }
        }
      },
      toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
        }
      },
      xAxis: [
          {
              type: 'category',
              axisPointer: {
                  type: 'shadow'
              },
              data:(()=>{
                var res=[];
                if(this.state.optionData){
                  this.state.optionData.map(item=>{
                    res.push(item.creater)
                  })
                }
                return res;
              })(),  
          }
      ],
      yAxis: [
          {
              type: 'value',
              name: '日志提交次数',
              min: 0,
              max: 40,
              interval: 5,
              axisLabel: {
                  formatter: '{value} '
              }
          },
      ],
      series: [
          {
              name:'日志提交次数',
              type:'bar',
              label:{normal:{
                show: true,
              }},
              data:(()=>{
                var res=[];
                if(this.state.optionData){
                  this.state.optionData.map(item=>{
                    res.push({value:item['COUNT(*)'],name:item.creater})
                  });
                }
                return res;
              })(),
          },
      ]
    };
  }
  render(){
    return(
      this.state.option?
      <div>
        <ReactEcharts
          option={this.getOption()}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
      :
      <div></div>
    )
  }
}
