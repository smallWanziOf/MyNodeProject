//express_demo.js 文件
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require("path");
var cookieParser = require("cookie-parser");
var router = express.Router();
var mysql = require("mysql");

/**
 * 创建一个连接池链接mysql
 */
var db = mysql.createPool({
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'blog'
})

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
const multerObj = multer({dest:'upload'});
app.use(multerObj.any());

/**
 * 解析Cookie
 */
app.use(cookieParser());

/**
 * 设置跨域的请求
 */
app.all('*', function(req, res, next) {
  //res.header("Access-Control-Allow-Credentials","true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeil");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  if (req.method == 'OPTIONS') {
    res.sendStatus(200); /让options请求快速返回/
  }
  else {
    next();
  }
  }
)
/**
 * 获取添加新模块的数据接口
 */
app.post('/method/addModule',function(req,res){
  var item = req.body.menu;
  var child = req.body.child;
  var sub = req.body.sub;
  var subPath = req.body.path;
  db.query(`SELECT * FROM menu_item WHERE item='${item}'`,(error,data)=>{
    if(error) throw error;
    if(data.length<1){
      db.query(`INSERT INTO menu_item (item,child) VALUES ('${item}','${child}')`,(error,data1)=>{
        if(error) throw error;
        if(child){
          db.query(`INSERT INTO sub_menu_item (parent,item,path) VALUES ('${item}','${sub}','${subPath}')`,(error,data2)=>{
            if(error) throw error;
            res.send(JSON.stringify({code:'S'}));
          })
        }else{
          res.send(JSON.stringify({code:'S'}));
        }
      })
    }else{
      res.send(JSON.stringify({code:'E',data:"主模块已存在请勿重复添加!"}))
    }
  })
})

/**
 * 获取主页面目录的接口
 */
app.get('/method/getMenuList',(req,res)=>{
  db.query(`SELECT * FROM menu_item`,(error,data)=>{
    if(error) throw error;
    db.query(`SELECT * FROM sub_menu_item`,(error,subData)=>{
      if(error) throw error;
      data.map(item=>{
        if(item.child == "true"){
          item.child = []
          subData.map(subItem=>{
            if(item.item == subItem.parent){
              item.child.push(subItem)
            }
          })
        }
      })
      res.send(JSON.stringify(data))
    })
  })
})

/**
 * 文件上传的接口
 */
app.post('/file_upload',function(req,res) {
  var newName = req.files[0].filename + path.parse(req.files[0].originalname).ext;
  console.log( req.files[0])
  fs.rename(path.join(__dirname,"/upload",req.files[0].filename),path.join(__dirname,"/upload",req.files[0].originalname),(err)=>{
    if(err)
      console.log(err);
    res.end();
  });
})

/**
 * 针对路由地址刷新报错的情况
 */
app.use(express.static('public'));
app.use(function(req, res, next) {
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
});

/**
 * 启动服务监听8010端口
 */
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})