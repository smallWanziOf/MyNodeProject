import React,{Component} from "react";
import {Link} from "react-router-dom";
import Header from "./Header";

export default class Main extends Component{
  constructor(props){
    super(props);
    this.state={
      canrender:false
    }
  }

  renderSection = () => {
    return <section style={{margin:'90px 20px 100px 300px'}}>{this.props.children}</section>
  }

  componentWillMount(){
    
    if(TANGJG.getCookie('name')){
      this.setState({
        canrender:true
      })
    }else{
      this.setState({
        canrender:false
      });
      TANGJG.loginExpires()
    }
  }

  render(){
    return (
      <div>
        {
          this.state.canrender?
          <div id="content">
            <Header/>
            {
              this.renderSection()
            }
          </div>
          :
          ''
        }
      </div>

    )
  }
}