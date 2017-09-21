import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DatePicker,DropDownMenu,MenuItem,RaisedButton,FontIcon,Paper} from "material-ui";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

/**
 * 查询天气
 */

export default class LogQuery extends Component{
  
  constructor(prop){
    super(prop);
    this.state = {
      dataSource:[],
      citykey:101020100,
      city:'',
      wendu:'',
      forecast:'',
      todyWeather:'',
      zhishu:[],
      togalShow:0,
      forcastWeather:[],
      moveTop:'200px',
    }
  }

  componentWillMount(){
    this.fetchLog();
  }

  componentDidMount(){
    this.refs.videoPlay.play();
    var me = this;
    this.refs.locationLogo.onmouseover=function(event){
      me.setState({
        togalShow:1,
        moveTop:'360px',
      })
    };
    this.refs.locationLogo.onmouseout=function(){
      me.setState({
        togalShow:0,
        moveTop:'200px',
      })
    };
  }

  //获取xml中的有效信息
  xmlSplice = (json,tag,gbl,index) => {
    if(json){
      var reg = new RegExp(`<${tag}>.*<\/${tag}>`, gbl||'g');
      var placeReg = new RegExp(`<${tag}>|<\/${tag}>`, gbl||'g');
      var value = json.match(reg)[index||0].replace(placeReg,"");
      if(tag === "forecast"){
        value = value.split("<weather>");
        value.map((item,i)=>{
          if(i>0){
            var newItem = item.replace(/<\/weather>/g,"");
            value[i-1] = newItem;
          }
        })
        this.setState({
          [tag]:value
        },()=>{
          //设置今天的天气
          this.setTodayWeather(value[0],'type','todyWeather');
          //设置预测的天气
          this.setForcastWeather(value)
        })
      }else if(tag === "zhishus"){
        value = value.split("<zhishu>");
        value.map((item,i)=>{
          if(i>0){
            var newItem = item.replace(/<\/zhishu>/g,"");
            value[i-1] = newItem;
          }
        })
        this.setState({
          [tag]:value
        },()=>{
          //转换xml成数组
          this.changeXMLToArray(value)
        })
      }else{
        this.setState({
          [tag]:value
        })
      }
    }
  }

  //设置今天的天气
  setTodayWeather = (json,tag,filed) => {
    var reg = new RegExp(`<${tag}>.{1,10}<\/${tag}>`,"g");
    var placeReg = new RegExp(`<${tag}>|<\/${tag}>`,"g");
    var value = json.match(reg)[0].replace(placeReg,"");
    this.setState({
      [filed]:value
    })
  }

  //设置预测的天气
  setForcastWeather = (value) => {
    var arr = [];
    value.map(item=>{
      var date = this.parseXML(item,'date');
      var high = this.parseXML(item,'high');
      var low = this.parseXML(item,'low');
      var day = this.parseXML(item,'day');
      var daytype = this.parseXML(day,'type');
      var dayfengxiang = this.parseXML(day,'fengxiang');
      var night = this.parseXML(item,'night');
      var nighttype = this.parseXML(night,'type');
      var nightfengxiang = this.parseXML(night,'fengxiang');
      arr.push({date,high,low,daytype,dayfengxiang,nighttype,nightfengxiang});
    });
    this.setState({
      forcastWeather:arr.slice(0,arr.length-1)
    })
  }

  //转换要解析的的xml
  parseXML = (json,tag,limit) => {
    var reg = new RegExp(`<${tag}>.{1,${limit||100}}<\/${tag}>`,"g");
    var placeReg = new RegExp(`<${tag}>|<\/${tag}>`,"g");
    var value = json.match(reg)[0].replace(placeReg,"");
    return value;
  }

  //转换xml为数组
  changeXMLToArray = (value) => {
    var arr = [];
    value.map(item=>{
      var name = this.parseXML(item,'name');
      var value = this.parseXML(item,'value');
      var detail = this.parseXML(item,'detail');
      arr.push({name,value,detail});
    });
    this.setState({
      zhishu:arr.slice(0,arr.length-1)
    })
  }

  //查询上海的天气
  fetchLog = () => {
    let {citykey} = this.state;
    fetch(`http://wthrcdn.etouch.cn/WeatherApi?citykey=${citykey}`,{
      cros:'no-cors'
    })
    .then(res=>res.text())
    .then(json=>{
      this.setState({
        dataSource:json
      },()=>{
        this.xmlSplice(json,'city');
        this.xmlSplice(json,'wendu');
        this.xmlSplice(json,'forecast');
        this.xmlSplice(json,'zhishus');
      })
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
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

  //改变旗帜的颜色
  changeFlagColor = () => {
    let r,g,b;
    r = parseInt(Math.random()*256);
    g = parseInt(Math.random()*256);
    b = parseInt(Math.random()*256);
    return `rgba(${r},${g},${b},0.4)`;
  }

  render(){
    let {city,wendu,todyWeather,zhishu,togalShow,forcastWeather,moveTop} = this.state;
    const cityStyle= {
      margin:'0 10px', 
    }
    return (
      <div style={{marginTop:50}} id="LogQuery">
        <div className="tang-SqlBtn" style={{position:'fixed',top:0,right:0,bottom:0,left:0}}>
          <video ref="videoPlay" autoplay="autoplay" width="100%" height="auto" preload="preload" loop="loop">
            <source src="src/video/video830.mp4" type="video/mp4" />
          </video>
          <div  style={{position:'absolute',width:350,height:50,top:70,right:0,borderRadius:30,backgroundColor:'rgba(0,0,0,0.4)',color:'#fff'}}>
            <div style={{width:300,margin:'0 auto',height:50,lineHeight:'50px'}}>
              <i className="fa fa-map-marker" aria-hidden="true"></i>
              <span style={cityStyle}>{city&&city}</span>
              <span style={cityStyle}>|</span>
              <span style={cityStyle}>{forcastWeather.length>0&&forcastWeather[0].date}</span>
              <span style={cityStyle}>{wendu&&wendu}℃</span>
              <span style={cityStyle}>{todyWeather&&todyWeather}</span>
            </div>
            <div ref="locationLogo" style={{position:'absolute',top:0,zIndex:'2',width:'100%',height:50}}></div>
          </div>
          <div style={{position:'absolute',top:moveTop,left:250,color:'#fff',textAlign:'center',transition:'all linear .3s'}}>
            {
              zhishu.length>0?zhishu.map((item,i)=>{
                return  <div style={{width:250,height:100,textAlign:'left',backgroundColor:this.changeFlagColor(),borderRadius:'15%',float:'left',margin:'20px',padding:'10px'}}>
                          <p>{item.name}：{item.value}</p>
                          <p>建议：{item.detail}</p>
                        </div>
              })
              :null
            }
          </div>
          <div style={{position:'absolute',top:130,right:'2px',color:'#fff',textAlign:'center',width:700}}>
            {
              forcastWeather.length>0?forcastWeather.map((item,i)=>{
                return  <div style={{opacity:togalShow,backgroundColor:'rgba(0,0,0,0.6)',borderRadius:'5%',marginBottom:10,transition:`all linear ${i*2*0.1}s`}}>
                          <span style={{display:'inline-block',width:100,textAlign:'left',padding:10}}>{item.date}</span>
                          <span style={{display:'inline-block',width:100,textAlign:'left',padding:10}}>{item.high}</span>
                          <span style={{display:'inline-block',width:100,textAlign:'left',padding:10}}>{item.low}</span>
                          <span style={{display:'inline-block',width:150,textAlign:'left',padding:10}}>白天：{item.daytype} {item.dayfengxiang}</span>
                          <span style={{display:'inline-block',width:150,textAlign:'left',padding:10}}>夜里：{item.nighttype} {item.nightfengxiang}</span>
                        </div>
              })
              :null
            }
          </div>
        </div>
      </div>
    )
  }

}
