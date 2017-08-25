import React,{Component} from "react";
import {Link} from "react-router-dom";
import {RaisedButton,AppBar,FlatButton,IconButton,Dialog,Drawer,MenuItem,Avatar,Menu,FontIcon,ListItem} from 'material-ui';

export default class Header extends Component{

  constructor(props){
    super(props);
    this.state={
      drawerOpen: true,
      dialogOpen:false,
      itemOptenKey:null,
      dataItem:null,
    }
  }

  componentWillMount = () => {
    fetch(`${TANGJG.HOST}/method/getMenuList`,{
      credentials: 'include',
      method: 'GET',
      headers:{
        "Content-Type":"application/json"
      },
    })
    .then(res=>{return res.json()})
    .then(data=>{
      this.setState({
        dataItem:data,
      })
    })
    .catch(err=>{
      TANGJG.loginExpires()
    })
  }

  handleLogin = () => {
    this.setState({
      dialogOpen:true,
    })
  }

  handleDrawer = () => {
    this.setState({
      drawerOpen:!this.state.drawerOpen,
    })
  }

  handleClose = () => {
    this.setState({dialogOpen: false});
  };

  buttonAction = () => <FlatButton label="OK" primary={true} onTouchTap={this.handleClose}/>

  itemClick = (e,value) => {
    value == this.state.itemOptenKey?
    this.setState({
      itemOptenKey:null
    })
    :
    this.setState({
      itemOptenKey:value
    })
  }

  render(){
    let {dataItem} = this.state;
    return(
      <header id="Header">
        <AppBar
          title="欢迎！TangJG"
          iconElementLeft={<Role/>}
          iconElementRight={<Login />}
          onRightIconButtonTouchTap={this.handleLogin}
        />
        <Dialog
          title="Dialog With Actions"
          modal={false}
          actions={this.buttonAction()}
          open={this.state.dialogOpen}
          onRequestClose={this.handleClose}
        >
          你好这是一个测试组件！请不要在意
        </Dialog>
        <Drawer open={this.state.drawerOpen} containerClassName="tang-header-drawer">
          {
            dataItem?
            dataItem.map((item,i)=>{
              if(Array.isArray(item.child)){
                return (
                  <Menu onChange={this.itemClick} key={i}>
                    <MenuItem primaryText={item.item}
                      rightIcon={
                        <FontIcon className={(this.state.itemOptenKey == i)?"fa fa-angle-down":"fa fa-angle-up"} style={{right: '30px'}}></FontIcon>
                      } 
                      value={i}
                    />
                    {
                      item.child.map((subItem,s)=>{
                        return (
                          (this.state.itemOptenKey == i)&&
                          <Link className="tang-reast-a" to={subItem.path} key={s}>
                            <ListItem className="tang-sub-item">{subItem.item}</ListItem>
                          </Link>
                        )
                      })
                    }
                  </Menu>
                )
              }
              return (
                <Menu onChange={this.itemClick} key={i}>
                  <MenuItem primaryText={item.item}
                    rightIcon={
                      <FontIcon className={(this.state.itemOptenKey == i)?"fa fa-angle-down":"fa fa-angle-up"} style={{right: '30px'}}></FontIcon>
                    } 
                    value={i}
                    key={i}
                  />
                </Menu>
              )
            })
            :
            ''
          }

        </Drawer>
      </header>
    )
  }
}

class Login extends Component {
  static muiName = 'FlatButton';
  render() {
    return (
      <FlatButton {...this.props} label="退出" />
    );
  }
}

class Role extends Component {
  render() {
    return (
      <Avatar
        src="upload/role/Koala.jpg"
        size={30}
        style={{marginTop:10}}
      />
    );
  }
}