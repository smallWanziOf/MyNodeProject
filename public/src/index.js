import "./config";
import "./style/style.less";
import 'whatwg-fetch';
import React,{Component} from "react";
import {render} from "react-dom";
import { HashRouter , Route , Link} from 'react-router-dom';
import Main from './containers/Main';
import Child from './containers/Child';
import Login from './containers/Login';
import AddModule from './containers/AddModule';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin  from "react-tap-event-plugin";
injectTapEventPlugin();

const _routes=(
  <MuiThemeProvider>
    <Main>
      <Route path="/addModule" component={AddModule}/>
    </Main>
  </MuiThemeProvider>
)

render((
  <HashRouter>{_routes}</HashRouter>),
  document.getElementById("tang")
)