import React,{Component} from "react";
import Pagination from "./Component/Pagination";
import {Link,Redirect} from "react-router-dom";
import moment from "moment";
import {DatePicker,DropDownMenu,MenuItem,RaisedButton,Checkbox,Slider,TextField} from "material-ui";
/**
 * 创建游戏推荐
 */
export default class CreateGameRecommend extends Component{
  
  constructor(prop){
    super(prop);
    this.state = {
      secondSlider: 60,
      articleDate:new Date(),
    }
  }

  handleSecondSlider = (event, value) => {
    this.setState({secondSlider: value});
  };

  //日期选择函数
  handleChangeMinDate = (n,date) => {
    this.setState({
      articleDate:date
    })
  }

  render(){
    return (
      <div style={{marginTop:50}} id="CreateGameRecommend">
        <TextField
          hintText=""
          floatingLabelText="游戏名称"
          id="gameName"
        /><br />
        <TextField
          hintText=""
          floatingLabelText="推荐人"
          id="recommendName"
        /><br />
        <DatePicker
          onChange={this.handleChangeMinDate}
          floatingLabelText="推荐日期"
          container="inline"
          value={this.state.articleDate}
        /><br/>
        <Slider
          min={0}
          max={100}
          step={1}
          value={this.state.secondSlider}
          onChange={this.handleSecondSlider}
        />
        <p>游戏评分：{this.state.secondSlider}</p>
      </div>
    )
  }

}
