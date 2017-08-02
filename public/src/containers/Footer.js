import React,{Component} from "react";
import {Link} from "react-router-dom";
export default class Footer extends Component{
  render(){
    return(
      <div>
        <Link to="/admin.html">跳转admmin</Link>
        <Link to="/login.html">跳转login</Link>
      </div>
    )
  }
}