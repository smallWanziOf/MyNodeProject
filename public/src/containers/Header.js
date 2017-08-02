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
    }
  }

  handleLogin = () => {
    console.log(this)
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
          <Menu onChange={this.itemClick}>
            <MenuItem primaryText="前端开发"
              rightIcon={
                <FontIcon className={(this.state.itemOptenKey == 0)?"fa fa-angle-down":"fa fa-angle-up"} style={{right: '30px'}}></FontIcon>
              } 
              value={0}
            />
            {
              (this.state.itemOptenKey == 0)&&
              <div>
                <ListItem className="tang-sub-item">HTML</ListItem>
                <ListItem className="tang-sub-item">CSS</ListItem>
                <ListItem className="tang-sub-item">JavaScript</ListItem>
              </div>
            }
            <MenuItem primaryText="后端开发" 
              rightIcon={
                <FontIcon className={(this.state.itemOptenKey == 1)?"fa fa-angle-down":"fa fa-angle-up"} style={{right: '30px'}}></FontIcon>
              }
              value={1}
            />
            {
              (this.state.itemOptenKey == 1)&&
              <div>
                <ListItem className="tang-sub-item">HTML</ListItem>
                <ListItem className="tang-sub-item">CSS</ListItem>
                <ListItem className="tang-sub-item">JavaScript</ListItem>
              </div>
            }
            <MenuItem primaryText="开发工具" 
              rightIcon={<FontIcon className="fa fa-angle-down" style={{right: '30px'}}></FontIcon>}
              value={2}
            />
            <ListItem className="tang-sub-item">Webpack</ListItem>
            <ListItem className="tang-sub-item">Gulp</ListItem>
            <MenuItem primaryText="服务器" 
              rightIcon={<FontIcon className="fa fa-angle-down" style={{right: '30px'}}></FontIcon>}
              value={3}
            />
            <ListItem className="tang-sub-item">Nginx</ListItem>
            <MenuItem primaryText="学习计划" 
              rightIcon={<FontIcon className="fa fa-angle-down" style={{right: '30px'}}></FontIcon>}
              value={4}
            />
            <ListItem className="tang-sub-item">Nginx</ListItem>
            <MenuItem primaryText="页面管理" 
              rightIcon={<FontIcon className="fa fa-angle-down" style={{right: '30px'}}></FontIcon>}
              value={5}
            />
            <ListItem className="tang-sub-item">
              <Link to="/pageManage">Nginx</Link>
            </ListItem>
          </Menu>
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