import "./style/style.less";

import React,{Component} from "react";
import {render} from "react-dom";
import { BrowserRouter , Route , Link} from 'react-router-dom';
import Main from './containers/Main';
import Child from './containers/Child';
import Login from './containers/Login';
import PageManage from './containers/PageManage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin  from "react-tap-event-plugin";
injectTapEventPlugin();

const _routes=(
  <MuiThemeProvider>
    <Main>
      <Route path="/pageManage" component={PageManage}/>
    </Main>
  </MuiThemeProvider>
)

render((
  <BrowserRouter>{_routes}</BrowserRouter>),
  document.getElementById("tang")
)