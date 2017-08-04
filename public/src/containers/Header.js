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
      mode:'cors',
      method: 'GET',
      headers:{
        "Content-Type":"application/json"
      }
    })
    .then(res=>{return res.json()})
    .then(data=>{
      console.log(data)
      this.setState({
        dataItem:data,
      })
    })
    .catch(err=>{
      console.log(err)
    })
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
            dataItem.data.map((item,i)=>{
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
                          (this.state.itemOptenKey == 0)&&
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
           {/* <MenuItem primaryText="前端开发"
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
            */}
          <Menu>
            <MenuItem primaryText="页面管理" 
              rightIcon={<FontIcon className="fa fa-angle-down" style={{right: '30px'}}></FontIcon>}
              value={5}
            >
            </MenuItem>
            <Link className="tang-reast-a" to="/addModule">
              <ListItem className="tang-sub-item">新增模块</ListItem>
            </Link>
            <Link className="tang-reast-a" to="/changeTheme">
              <ListItem className="tang-sub-item">更换主题</ListItem>
            </Link>
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