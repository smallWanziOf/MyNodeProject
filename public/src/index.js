import "./config";
import "./style/style.less";
import 'whatwg-fetch';
import React,{Component} from "react";
import {render} from "react-dom";
import { BrowserRouter , Route , Link , Redirect} from 'react-router-dom';
import Main from './containers/Main';
import Child from './containers/Child';
import Login from './containers/Login';
import AddModule from './containers/AddModule';
import ManageModule from './containers/ManageModule';
import ManageHtml from './containers/ManageHtml';
import ManageCss from './containers/ManageCss';
import ManageJs from './containers/ManageJs';
import EditHtmlArticle from './containers/EditHtmlArticle';
import EditCssArticle from './containers/EditCssArticle';
import EditJsArticle from './containers/EditJsArticle';
import AddLog from './containers/AddLog';
import LogQuery from './containers/LogQuery';
import LogDetail from './containers/LogDetail';
import Welcome from './containers/Welcome';
import GameRecommend from './containers/GameRecommend';
import CreateGameRecommend from './containers/CreateGameRecommend';
import StaffComment from './containers/StaffComment';
import PrivateChat from './containers/PrivateChat';
import ManageUser from './containers/ManageUser';
import ChangePassword from './containers/ChangePassword';
import NetSatin from './containers/NetSatin';
import AddNetSatin from './containers/AddNetSatin';
import TeamBuild from './containers/TeamBuild';
import CreateTeamBuild from './containers/CreateTeamBuild';
import StartSchedule from './containers/StartSchedule';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin  from "react-tap-event-plugin";
injectTapEventPlugin();

const _routes=(
  <MuiThemeProvider>
    <div>
      <Route path="/login" component={Login}/>
      <Main>
        <Route path="/" exact={true} component={Welcome}/>
        <Route path="/addModule" component={AddModule}/>
        <Route path="/manageModule" component={ManageModule}/>
        <Route path="/manageHtml" component={ManageHtml}/>
        <Route path="/manageCss" component={ManageCss}/>
        <Route path="/manageJs" component={ManageJs}/>
        <Route path="/editHtmlArticle" component={EditHtmlArticle}/>
        <Route path="/editCssArticle" component={EditCssArticle}/>
        <Route path="/editJsArticle" component={EditJsArticle}/>
        <Route path="/addLog" component={AddLog}/>
        <Route path="/logQuery" component={LogQuery}/>
        <Route path="/logDetail" component={LogDetail}/>
        <Route path="/gameRecommend"   component={GameRecommend}/>
        <Route path="/createGameRecommend" component={CreateGameRecommend}/>
        <Route path="/staffComment" component={StaffComment}/>
        <Route path="/privateChat" component={PrivateChat}/>
        <Route path="/manageUser" component={ManageUser}/>
        <Route path="/changePassword" component={ChangePassword}/>
        <Route path="/netSatin" component={NetSatin}/>
        <Route path="/addNetSatin" component={AddNetSatin}/>
        <Route path="/teamBuild" component={TeamBuild}/>
        <Route path="/createTeamBuild" component={CreateTeamBuild}/>
        <Route path="/startSchedule" component={StartSchedule}/>
      </Main>
    </div>
  </MuiThemeProvider>
)

render((
  <BrowserRouter>{_routes}</BrowserRouter>),
  document.getElementById("tang")
)