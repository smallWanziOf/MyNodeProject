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
var crypto = require('crypto');
var hashValue = "tang|jian|guo|唐建国";
/**
 *md5加密密码 
 */

var md5 = function(pwd) {
  var hash = crypto.createHash('md5');
  hash.update(pwd+hashValue);
  var sign = hash.digest('hex');
  return sign;
}
/**
 * md5解密
 */
var verifysign = function(sign){
  return crypto.createHash('md5').update(sign,'utf-8').digest('hex');
}
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
  db.query(`SELECT username,password FROM user_table WHERE binary username='${username}'`,(err,data)=>{
    if(err){
      res.send(JSON.stringify({code:'E',msg:'登录错误'}));
      return false;
    }else{
      if(data.length<1){
        res.send(JSON.stringify({code:'U',msg:'用户名不存在'}));
        return false;
      }else{
        if(md5(password+hashValue) === data[0].password){
          req.session.username = req.sessionID;
          req.session.user = username;
          res.send({code:"S", msg: username});                           
        }else{
          res.send(JSON.stringify({code:'P',msg:'密码错误'}));
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
  let sqlString = `SELECT * FROM menu_item`;
  if(req.session.user !== 'admin'){
    sqlString = `SELECT * FROM menu_item WHERE ID!=1`;
  }
  db.query(sqlString,(error,data)=>{
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
  db.query(`SELECT * FROM staff`,(error,data)=>{
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
 *获取所有日志
 */
app.post('/method/queryLog',(req,res)=>{
  let page = req.query.page,
  staffValue = req.body.staffValue,
  articleDate = req.body.articleDate;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[],total:0}));
    return false;
  }else{
    let staffValueSql = `AND creater='${staffValue}'`,
    articleDateSql = `AND logTime='${articleDate}'`;
    if(staffValue === ''){
      staffValueSql = '';
    }
    if(articleDate === ''){
      articleDateSql = '';
    }
    let adminSqlCount = `SELECT COUNT(ID) AS total FROM log_table WHERE secret='false' ${staffValueSql} ${articleDateSql}`,
    adminSqlData = `SELECT ID,creater,logTime,secret,log FROM log_table WHERE secret='false' ${staffValueSql} ${articleDateSql} ORDER BY ID DESC LIMIT ${(page-1)*10},10`;
    if(req.session.user === 'admin'){
      let sqlString = ''; 
      if(staffValue === '' && articleDate === ''){
        sqlString = '';
      }else if(articleDate === ''){
        sqlString = `WHERE creater='${staffValue}'`;
      }else if(staffValue === ''){
        sqlString = `WHERE logTime='${articleDate}'`;
      }else{
        sqlString = `WHERE logTime='${articleDate}' AND creater='${staffValue}'`;
      }
      adminSqlCount = `SELECT COUNT(ID) AS total FROM log_table ${sqlString}`;
      adminSqlData = `SELECT ID,creater,logTime,secret,log FROM log_table ${sqlString} ORDER BY ID DESC LIMIT ${(page-1)*10},10`;
    }
    db.query(adminSqlCount,(error,data1)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        db.query(adminSqlData,(error,data2)=>{
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
 * 登入界面快速链接跳转获取所有的子模块
 */
app.get('/method/queryAllSubItem',(req,res)=>{
  db.query(`SELECT * FROM sub_menu_item`,(error,data)=>{
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
 * 员工互评信息查询
 */
app.get('/method/queryStaffComment',(req,res)=>{
  db.query(`SELECT * FROM staff_comment`,(error,data)=>{
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
 * 提交互评表
 */
app.post('/method/submitStaffComment',(req,res)=>{
  let {TDYS,HQ,JSRWZT,GZRQ,ZRG,JLX,JQX,XG,XQAH,YBYR,staffValue,departmentValue,others} = req.body;
  db.query(`INSERT INTO staff_submit_comment (TDYS,HQ,JSRWZT,GZRQ,ZRG,JLX,JQX,XG,XQAH,YBYR,staffValue,departmentValue,others)
  VALUES ('${TDYS}','${HQ}','${JSRWZT}','${GZRQ}','${ZRG}','${JLX}','${JQX}','${XG}','${XQAH}','${YBYR}','${staffValue}','${departmentValue}','${others}')`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:"E",msg:error}));
      return false;
    }else{
      res.send(JSON.stringify({code:'S'}));
      return false;
    }
  })
})

/**
 * 获取和自己相关的互评信息
 */
app.get('/method/querySubmitComment',(req,res)=>{
  db.query(`SELECT * FROM staff_submit_comment WHERE staffValue='${req.session.user}'`,(error,data)=>{
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
 * 获取所有的部门信息
 */
app.get('/method/queryDepartment',(req,res)=>{
  db.query(`SELECT * FROM department`,(error,data)=>{
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
 * 查询所有的用户
 */
app.get('/method/queryAllUsers',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[],total:0}));
    return false;
  }else{
    db.query(`SELECT COUNT(ID) AS total FROM user_table WHERE ID!=1`,(error,data1)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        db.query(`SELECT ID,username,user,src,role,creater FROM user_table WHERE ID!=1 ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
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
 * 添加一个新的用户
 */
app.post('/method/saveNewLoginUser',(req,res)=>{
  let account = req.body.account,
  role = req.body.role,
  user = req.body.user,
  creater = req.body.creater;
  if(account === '' || user === ''){
    res.send(JSON.stringify({code:'E',msg:'data is null or user is null'}));
    return false;
  }else{
    db.query(`SELECT * FROM user_table WHERE binary username='${account}' OR user='${user}'`,(error,data)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        return false;
      }else{
        if(data.length>0){
          res.send(JSON.stringify({code:'E',msg:'用户已存在！请勿重复添加'}));
          return false;
        }else{
          var mdPassword = md5('123'+hashValue);
          db.query(`INSERT INTO user_table (username,password,role,creater,user) VALUES ('${account}','${mdPassword}','${role}','${creater}','${user}')`,(error,data)=>{
            if(error){
              res.send(JSON.stringify({code:'E',msg:error}));
              return false;
            }else{
              db.query(`INSERT INTO staff (name,name_code) VALUES ('${user}','${account}')`,(error,data)=>{
                if(error){
                  res.send(JSON.stringify({code:'E',msg:error}));
                  return false;
                }else{
                  res.send(JSON.stringify({code:'S'}));
                  return false;
                }
              })
            }
          })
        }
      }
    })
  }
})

/**
 * 删除一个已添加的用户
 */
app.post('/method/deleteOldUser',(req,res)=>{
  let id = req.body.userID,
  user = req.body.user;
  console.log(user);
  if(id === '' || user === ''){
    res.send(JSON.stringify({code:'E',msg:'data is null'}));
    return false;
  }else{
    db.query(`DELETE FROM user_table WHERE ID=${id}`,(error,data)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        return false;
      }else{
        db.query(`DELETE FROM staff WHERE name_code='${user}'`,(error,data)=>{
          if(error){
            res.send(JSON.stringify({code:'E',msg:error}));
            return false;
          }else{
            res.send(JSON.stringify({code:'S'}));
            return false;
          }
        })
      }
    })
  }
})

/**
 * 分页查询所有的员工
 */
app.get('/method/queryAllStaff',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[],total:0}));
    return false;
  }else{
    db.query(`SELECT COUNT(ID) AS total FROM staff`,(error,data1)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        res.end();
        return false;
      }else{
        db.query(`SELECT * FROM staff ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
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
 * 获取登录者的基本信息--修改密码
 */
app.get('/method/getUserBaseInfo',(req,res)=>{
  res.send({code:'S',data:req.session.user})
})

/**
 * 修改密码
 */
app.post('/method/changePassword',(req,res)=>{
  let username = req.body.username,
      oldPassword = req.body.oldPassword,
      newPassword = req.body.newPassword;
  db.query(`SELECT password FROM user_table WHERE username='${username}'`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }else{
      if(data.length>1){
        res.send(JSON.stringify({code:'E',msg:'change error please connect admin'}));
        return false;
      }else if(data.length===0){
        res.send(JSON.stringify({code:'E',msg:'change error please connect admin no user!!!'}));
        return false;
      }else{
        var mdPassword = md5(newPassword+hashValue);
        if(data[0].password !== md5(oldPassword+hashValue)){
          res.send(JSON.stringify({code:'E',msg:'输入的原始密码有误'}));
          return false;
        }else{
          db.query(`UPDATE user_table SET password='${mdPassword}' WHERE username='${username}'`,(error,data)=>{
            if(error){
              res.send(JSON.stringify({code:'E',msg:error}));
              return false;
            }else{
              res.send(JSON.stringify({code:'S'}));
              return false;
            }
          })
        }
      }
    }
  })
})

/**
 * 上传段子的图片
 */
app.post('/method/fileUpload',function(req,res) {
  var newName = path.parse(req.files[0].originalname).ext;
  fs.rename(path.join(__dirname,"public/upload",req.files[0].filename),path.join(__dirname,"public/upload/satin",req.files[0].filename+newName),(err)=>{
    if(err){
      res.send(JSON.stringify({code:'E',msg:err}));
      return false;
    }
    res.send(JSON.stringify({code:'S',path:req.files[0].filename+newName}));
  });
})

/**
 * 删除段子中上传的图片
 */
app.post('/method/deleteSatinFile',function(req,res) {
  var src = req.body.src;
  fs.unlink(path.join(__dirname,'public/upload/satin',src),(error)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    res.send(JSON.stringify({code:'S'}));
  })
})

/**
 * 上传段子
 */
app.post('/method/submitSatin',(req,res)=>{
  let content = req.body.content,
  src = req.body.src;
  db.query(`INSERT INTO net_satin (content,src,author) VALUES ('${content}','${src}','${req.session.user}')`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    res.send(JSON.stringify({code:'S'}));
  })
})

/**
 * 查询所有的段子
 */
app.get('/method/querySubmitNetSatin',(req,res)=>{
  db.query(`SELECT ID,content,src,star,shit FROM net_satin ORDER BY ID DESC`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    res.send(JSON.stringify({code:'S',data:data}));
  })
})

/**
 * 为段子点赞
 */
app.post('/method/starSatin',(req,res)=>{
  let satin = req.body.satinID;
  if(satin === ''){
    res.send(JSON.stringify({code:'E',msg:error}));
    return false;
  }
  db.query(`SELECT star FROM net_satin WHERE ID=${satin}`,(error,data)=>{
    if(error || data.length<1){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    var star = parseInt(data[0].star) + 1;
    db.query(`UPDATE net_satin SET star='${star}' WHERE ID=${satin}`,(error,data)=>{
      if(error || data.length<1){
        res.send(JSON.stringify({code:'E',msg:error}));
        return false;
      }
      res.send(JSON.stringify({code:'S'}));
    })
  })
})

/**
 * 踩段子
 */
app.post('/method/shitSatin',(req,res)=>{
  let satin = req.body.satinID;
  if(satin === ''){
    res.send(JSON.stringify({code:'E',msg:error}));
    return false;
  }
  db.query(`SELECT shit FROM net_satin WHERE ID=${satin}`,(error,data)=>{
    if(error || data.length<1){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    var shit = parseInt(data[0].shit) + 1;
    db.query(`UPDATE net_satin SET shit='${shit}' WHERE ID=${satin}`,(error,data)=>{
      if(error || data.length<1){
        res.send(JSON.stringify({code:'E',msg:error}));
        return false;
      }
      res.send(JSON.stringify({code:'S'}));
    })
  })
})

/**
 * 点击加载十条段子
 */
app.get('/method/requestAgainSatin',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[]}));
    return false;
  }else{
    db.query(`SELECT ID,content,src,star,shit FROM net_satin ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
        return false;
      }else{
        res.send(JSON.stringify({code:"S",data:data2}));
        return false;
      }
    })
  }
})

/**
 * 上传团建的图片
 */
app.post('/method/upLoadTeamPicture',function(req,res) {
  var newName = path.parse(req.files[0].originalname).ext;
  fs.rename(path.join(__dirname,"public/upload",req.files[0].filename),path.join(__dirname,"public/upload/teamBuild",req.files[0].filename+newName),(err)=>{
    if(err){
      res.send(JSON.stringify({code:'E',msg:err}));
      return false;
    }
    res.send(JSON.stringify({code:'S',path:req.files[0].filename+newName}));
  });
})

/**
 * 删除上传团建的图片
 */
app.post('/method/deleteTeamFile',function(req,res) {
  var src = req.body.src;
  fs.unlink(path.join(__dirname,'public/upload/teamBuild',src),(error)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    res.send(JSON.stringify({code:'S'}));
  })
})

/**
 * 提交一次团建活动
 */
app.post('/method/submitTeamBuild',function(req,res){
  var teamAddress = req.body.teamAddress,
  teamSubAddress = req.body.teamSubAddress,
  teamPictureDesc = req.body.teamPictureDesc,
  teamPictureSubDesc = req.body.teamPictureSubDesc,
  teamReason = req.body.teamReason,
  src = req.body.path,
  time = req.body.time; 
  db.query(`INSERT INTO team_build (address,sub_address,src,src_desc,src_sub_desc,time,detail_desc,creater)
    VALUES ('${teamAddress}','${teamSubAddress}','${src}','${teamPictureDesc}','${teamPictureSubDesc}','${time}','${teamReason}','${req.session.user}')
  `,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    res.send(JSON.stringify({code:'S'}));
  })
})

/**
 * 查询所有的团建活动
 */
app.get('/method/queryTeamBuild',(req,res)=>{
  let page = req.query.page;
  db.query(`SELECT ID,address,sub_address,src,src_desc,src_sub_desc,time,detail_desc,join_num FROM team_build ORDER BY ID DESC LIMIT ${(page-1)*3},3`,(error,data)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }
    res.send(JSON.stringify({code:'S',data:data}));
  })
})

/**
 * 表示想参与这次活动
 */
app.post('/method/joinTeamBuild',(req,res)=>{
  let id = req.body.teamID;
  db.query(`SELECT join_num,join_name FROM team_build WHERE ID=${id}`,(error,data)=>{
    if(error || data.length<1){
      res.send(JSON.stringify({code:'E',msg:error}));
      return false;
    }else{
      let value = data[0].join_num;
      let name = data[0].join_name;
      if(name !== null){
        if(name.indexOf(`${req.session.user}`) !== -1){
          res.send(JSON.stringify({code:'E',msg:'你已表示想要参与过该活动'}));
          return false;
        }else{
          db.query(`UPDATE team_build SET join_num=${value+1},join_name='${name.concat(','+req.session.user)}' WHERE ID=${id}`,(error,data)=>{
            if(error){
              res.send(JSON.stringify({code:'E',msg:error}));
              return false;
            }else{
              res.send(JSON.stringify({code:'S'}));
            }
          })
        }
      }else{
        db.query(`UPDATE team_build SET join_num=${value+1},join_name='${req.session.user}' WHERE ID=${id}`,(error,data)=>{
          if(error){
            res.send(JSON.stringify({code:'E',msg:error}));
            return false;
          }else{
            res.send(JSON.stringify({code:'S'}));
          }
        })
      }
    }
  })
})

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
var server = app.listen(8081, '192.168.9.108' ,function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})