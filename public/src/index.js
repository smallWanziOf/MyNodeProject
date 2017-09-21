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
import TechnologyBase from './containers/TechnologyBase';
import EditTechnologyBase from './containers/EditTechnologyBase';
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
import WeatherForecast from './containers/WeatherForecast';
import ReadeArticle from './containers/ReadeArticle';
import ClassificationQuery from './containers/ClassificationQuery';

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
        <Route path="/technologyBase" component={TechnologyBase}/>
        <Route path="/editTechnologyBase" component={EditTechnologyBase}/>
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
        <Route path="/weatherForecast" component={WeatherForecast}/>
        <Route path="/readeArticle" component={ReadeArticle}/>
        <Route path="/classificationQuery" component={ClassificationQuery}/>
      </Main>
    </div>
  </MuiThemeProvider>
)

render((
  <BrowserRouter>{_routes}</BrowserRouter>),
  document.getElementById("tang")
)