//express_demo.js 文件
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require("path");
var cookieParser = require("cookie-parser");
//var router = express.Router();
var mysql = require("mysql");
var session = require("express-session");
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
 * session相关配置
 */
var key = "tang_cat"
app.use(session({
  name:'session_id',
  secret: key,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 20*60*1000 }
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

app.use('/method',function(req,res,next){
  var clientS = cookieParser.signedCookies(req.cookies,key);
  if((clientS.session_id !== req.session.username) && req.path!=='/login'){
    res.status(500);
    res.send('当前登录已过期请重新登录');
  }else{
    next();
  }
})

/**
 * 用户登录验证
 */
app.post('/method/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  db.query(`SELECT username,password FROM user_table WHERE username='${username}'`,(err,data)=>{
    if(err){
      res.send(JSON.stringify({code:'E',msg:'登录错误'}));
      return false;
    }else{
      if(data.length<1){
        res.send(JSON.stringify({code:'E',msg:'用户名不存在'}));
        return false;
      }else{
        if(password == data[0].password){
          req.session.username = req.sessionID;
          req.session.user = username;
          res.send({code:"S", msg: username});                           
        }else{
          res.send(JSON.stringify({code:'E',msg:'密码错误'}));
          return false;
        }
      }
    }
  })
})

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
 * 获取当前选择主目录下的子目录
 */
app.get('/method/getSubList',(req,res)=>{
  db.query(`SELECT * FROM sub_menu_item WHERE parent='${req.query.parent}'`,(error,data)=>{
    if(error) throw error;
    res.send(JSON.stringify(data))
  })
})

/**
 * 提交修改或是添加的子目录
 */
app.post('/method/submitSubItem',(req,res)=>{
  let {parent,item,subPath} = req.body;
  if(req.query.id<0){
    db.query(`INSERT INTO sub_menu_item (parent,item,path) VALUES ('${parent}','${item}','${subPath}')`,(error,data)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      } 
      res.send(JSON.stringify({code:'S'}));
    })
  }else{
    db.query(`UPDATE sub_menu_item SET item='${item}',path='${subPath}' WHERE ID=${req.query.id}`,(error,data)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }
      res.send(JSON.stringify({code:'S'}));
    })
  }
})

/**
 * 删除父目录
 */
app.post('/method/deleteParent',(req,res)=>{
  db.query(`DELETE FROM menu_item WHERE ID=${req.body.parentID}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      res.end();
      return false;
    }else{
      db.query(`DELETE FROM sub_menu_item WHERE parent='${req.body.parentName}'`,(error,data)=>{
        if(error){
          res.send(JSON.stringify({code:'E',msg:error}));
          res.end();
          return false;
        }else{
          res.send(JSON.stringify({code:'S'}));
          res.end();
        }
      })
    }
  })
})

/**
 * 删除一行子目录
 */
app.post('/method/deleteSubLine',(req,res)=>{
  if(req.query.id!='undefinde'){
    db.query(`DELETE FROM sub_menu_item WHERE ID=${req.query.id}`,(error,data)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        res.send(JSON.stringify({code:'S'}));
        res.end();
      }
    })
  }
})

/**
 * 发表新的html文章
 */
app.post('/method/publishHtmlArticle',(req,res)=>{
  let {title,summary,author,articleDate,article} = req.body;
  db.query(`INSERT INTO article_html (title,summary,author,articleDate,article) VALUES ('${title}','${summary}','${author}','${articleDate}','${article}')`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})

/**
 *获取所有发表的HTML文章 
 */
app.get('/method/queryHtmlArticle',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[],total:0}));
    return false;
  }else{
    db.query(`SELECT COUNT(ID) AS total FROM article_html`,(error,data1)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        db.query(`SELECT ID,title,summary,author,articleDate FROM article_html ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
          if(error){
            res.send(JSON.stringify({code:'E',msg:error}));
            res.end();
            return false;
          }else{
            res.send(JSON.stringify({code:"S",data:data2,total:data1[0].total}));
            return false;
          }
        })
      }
    })
  }
})

/**
 * 通过ID查询单片文章进行编辑文章的操作
 */
app.get('/method/queryHtmlAtticleFromId',(req,res)=>{
  let id = req.query.id;
  db.query(`SELECT * FROM article_html WHERE ID = ${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S',data:data}));
      res.end();
      return false;
    }
  })
})

/**
 * 通过Id修改HTMl文章
 */
app.post('/method/EditHtmlArticleFromId',(req,res)=>{
  let {title,summary,author,articleDate,article} = req.body;
  let id = req.query.id;
  db.query(`UPDATE article_html SET title='${title}',summary='${summary}',author='${author}',articleDate='${articleDate}',article='${article}' WHERE ID=${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})

/**
 * 通过ID删除一篇文章
 */
app.get('/method/deleteHtmlArticle',(req,res)=>{
  let id = req.query.id;
  db.query(`DELETE FROM article_html WHERE ID=${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})


/**
 * 发表新的css文章
 */
app.post('/method/publishCssArticle',(req,res)=>{
  let {title,summary,author,articleDate,article} = req.body;
  db.query(`INSERT INTO article_css (title,summary,author,articleDate,article) VALUES ('${title}','${summary}','${author}','${articleDate}','${article}')`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})

/**
 *获取所有发表的css文章 
 */
app.get('/method/queryCssArticle',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[],total:0}));
    return false;
  }else{
    db.query(`SELECT COUNT(ID) AS total FROM article_css`,(error,data1)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        db.query(`SELECT ID,title,summary,author,articleDate FROM article_css ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
          if(error){
            res.send(JSON.stringify({code:'E',msg:error}));
            res.end();
            return false;
          }else{
            res.send(JSON.stringify({code:"S",data:data2,total:data1[0].total}));
            return false;
          }
        })
      }
    })
  }
})

/**
 * 通过ID查询单片文章进行编辑文章的操作
 */
app.get('/method/queryCssAtticleFromId',(req,res)=>{
  let id = req.query.id;
  db.query(`SELECT * FROM article_css WHERE ID = ${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S',data:data}));
      res.end();
      return false;
    }
  })
})

/**
 * 通过Id修改HTMl文章
 */
app.post('/method/EditCssArticleFromId',(req,res)=>{
  let {title,summary,author,articleDate,article} = req.body;
  let id = req.query.id;
  db.query(`UPDATE article_css SET title='${title}',summary='${summary}',author='${author}',articleDate='${articleDate}',article='${article}' WHERE ID=${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})

/**
 * 通过ID删除一篇文章
 */
app.get('/method/deleteCssArticle',(req,res)=>{
  let id = req.query.id;
  db.query(`DELETE FROM article_css WHERE ID=${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})


/**
 * 发表新的js文章
 */
app.post('/method/publishJsArticle',(req,res)=>{
  let {title,summary,author,articleDate,article} = req.body;
  db.query(`INSERT INTO article_js (title,summary,author,articleDate,article) VALUES ('${title}','${summary}','${author}','${articleDate}','${article}')`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})

/**
 *获取所有发表的css文章 
 */
app.get('/method/queryJsArticle',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[],total:0}));
    return false;
  }else{
    db.query(`SELECT COUNT(ID) AS total FROM article_js`,(error,data1)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        db.query(`SELECT ID,title,summary,author,articleDate FROM article_js ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
          if(error){
            res.send(JSON.stringify({code:'E',msg:error}));
            res.end();
            return false;
          }else{
            res.send(JSON.stringify({code:"S",data:data2,total:data1[0].total}));
            return false;
          }
        })
      }
    })
  }
})

/**
 * 通过ID查询单片文章进行编辑文章的操作
 */
app.get('/method/queryJsAtticleFromId',(req,res)=>{
  let id = req.query.id;
  db.query(`SELECT * FROM article_js WHERE ID = ${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S',data:data}));
      res.end();
      return false;
    }
  })
})

/**
 * 通过Id修改HTMl文章
 */
app.post('/method/EditJsArticleFromId',(req,res)=>{
  let {title,summary,author,articleDate,article} = req.body;
  let id = req.query.id;
  db.query(`UPDATE article_js SET title='${title}',summary='${summary}',author='${author}',articleDate='${articleDate}',article='${article}' WHERE ID=${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})

/**
 * 通过ID删除一篇文章
 */
app.get('/method/deleteJsArticle',(req,res)=>{
  let id = req.query.id;
  db.query(`DELETE FROM article_js WHERE ID=${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
  })
})

/**
 * 新建日志选择创建人
 */
app.get('/method/getStaff',(req,res)=>{
  db.query(`SELECT name FROM staff`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      return false;
    }else{
      res.send(JSON.stringify({code:'S',data:data}));
      return false;
    }
  })
})

/**
 * 提交新的日志记录
 */
app.post('/method/submitLog',(req,res)=>{
  let {creater,log,logTime,secret} = req.body;
  db.query(`INSERT INTO log_table (creater,log,logTime,secret) VALUES ('${creater}','${log}','${logTime}','${secret}')`,(error,data)=>{
    if(error){
      res.json({code:'E',msg:{error}});
      return false;
    }else{
      res.json({code:'S'});
      return false;
    }
  })
})

/**
 *获取所有的非隐私的日志
 */
app.get('/method/queryLog',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[],total:0}));
    return false;
  }else{
    db.query(`SELECT COUNT(ID) AS total FROM log_table WHERE secret='false'`,(error,data1)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        db.query(`SELECT ID,creater,logTime,secret,log FROM log_table WHERE secret='false' ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
          if(error){
            res.send(JSON.stringify({code:'E',msg:error}));
            res.end();
            return false;
          }else{
            res.send(JSON.stringify({code:"S",data:data2,total:data1[0].total}));
            return false;
          }
        })
      }
    })
  }
})

/**
 * 通过ID删除一篇日志
 */
app.get('/method/deleteLog',(req,res)=>{
  console.log(req.session.user)
  let id = req.query.id;
  db.query(`DELETE FROM log_table WHERE ID=${id}`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      res.end();
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      res.end();
      return false;
    }
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
var server = app.listen(8081, '192.168.9.108' ,function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})