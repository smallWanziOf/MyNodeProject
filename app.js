//express_demo.js 文件
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");

/**
 * 解析POST数据
 * create application/json parser
 * create application/x-www-form-urlencoded parser
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * 上传文件的类型及存放的路径
 */
const multerObj = multer({dest:'public/upload'});
app.use(multerObj.any());

/**
 * 解析Cookie
 */
app.use(cookieParser());

/**
 * session相关配置
 */
var key = "tang_cat"
app.use(session({
  name:'session_id',
  secret: key,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60*60*1000 }
}))

/**
 * 设置跨域的请求
 */
/*app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Credentials","true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeil");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  //res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == 'OPTIONS') {
    res.sendStatus(200); /让options请求快速返回/
  }else {
    next();
  }
})*/

/**
 *定时抓取段子的内容 
 */
var schedule = require("./server/schedule");

var baseRouter = require('./router/serverAPI.js');
app.use('/',baseRouter);

/**
 * 针对路由地址刷新报错的情况
 */
app.use(express.static('public'));
app.use(function(req, res, next) {
  if(req.url!=="/favicon.ico"){
    fs.readFile(__dirname + '/public/index.html', function(err, data){
      if(err){
        console.log(err);
        res.send('404');
      } else {
        res.writeHead(200, {
          'Content-type': 'text/html',
          'Connection':'keep-alive'
        });
        res.end(data);
      }
    })
  }else{
    res.end();
  }
});

/**
 * 启动服务监听8010端口
 */
var server = app.listen(8081, '192.168.10.32' ,function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})