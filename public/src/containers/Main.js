import React,{Component} from "react";
import {Link} from "react-router-dom";
import Header from "./Header";

export default class Main extends Component{
  constructor(props){
    super(props);
  }

  renderSection(){
    return <section style={{margin:'20px 20px 100px 300px'}}>{this.props.children}</section>
  }

  render(){
    return (
      <div id="content">
        <Header/>
        {
          ::this.renderSection()
        }
      </div>
    )
  }
}