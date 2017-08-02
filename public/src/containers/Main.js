import React,{Component} from "react";
import {Link} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
export default class Main extends Component{
  constructor(props){
    super(props);
  }

  renderSection(){
    return <section>{this.props.children}</section>
  }

  render(){
    return (
      <div>
        <Header/>
          {
            this.props.children
          }
        <Footer/>
      </div>
    )
  }
}