var express = require('express');
var router = express.Router();
var cookieParser = require("cookie-parser");
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var path = require("path");
const {md5,verifysign,hashValue} = require('./md5.js');
const {db} = require('./dbConfig.js');
var key = "tang_cat";
/**
 * 验证是否登录过期
 */
router.use('/method',function(req,res,next){
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
router.post('/method/login',function(req,res){
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
router.post('/method/addModule',function(req,res){
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
router.get('/method/getMenuList',(req,res)=>{
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
router.get('/method/getSubList',(req,res)=>{
  db.query(`SELECT * FROM sub_menu_item WHERE parent='${req.query.parent}'`,(error,data)=>{
    if(error) throw error;
    res.send(JSON.stringify(data))
  })
})

/**
 * 提交修改或是添加的子目录
 */
router.post('/method/submitSubItem',(req,res)=>{
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
router.post('/method/deleteParent',(req,res)=>{
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
router.post('/method/deleteSubLine',(req,res)=>{
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
router.post('/method/publishHtmlArticle',(req,res)=>{
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
router.get('/method/queryHtmlArticle',(req,res)=>{
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
router.get('/method/queryHtmlAtticleFromId',(req,res)=>{
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
router.post('/method/EditHtmlArticleFromId',(req,res)=>{
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
router.get('/method/deleteHtmlArticle',(req,res)=>{
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
router.post('/method/publishCssArticle',(req,res)=>{
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
router.get('/method/queryCssArticle',(req,res)=>{
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
router.get('/method/queryCssAtticleFromId',(req,res)=>{
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
router.post('/method/EditCssArticleFromId',(req,res)=>{
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
router.get('/method/deleteCssArticle',(req,res)=>{
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
router.post('/method/publishJsArticle',(req,res)=>{
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
router.get('/method/queryJsArticle',(req,res)=>{
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
router.get('/method/queryJsAtticleFromId',(req,res)=>{
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
router.post('/method/EditJsArticleFromId',(req,res)=>{
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
router.get('/method/deleteJsArticle',(req,res)=>{
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
 * 检索发表过的文章的内容
 */
router.post('/method/searchQueryJsArticle',(req,res)=>{
  let context = req.body.context;
  let page = req.body.page;
  db.query(`SELECT COUNT(ID) AS total FROM article_js WHERE article LIKE '%${context}%'`,(error,data1)=>{
    if(error){
      res.send(JSON.stringify({code:'E',msg:error}));
      res.end();
      return false;
    }else{
      db.query(`SELECT ID,title,summary,author,articleDate FROM article_js WHERE article LIKE '%${context}%' ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
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
})

/**
 * 新建日志选择创建人
 */
router.get('/method/getStaff',(req,res)=>{
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
router.post('/method/submitLog',(req,res)=>{
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
router.post('/method/queryLog',(req,res)=>{
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
 * 按月份汇总员工的日志
 */
router.get('/method/monthQueryLog',(req,res)=>{
  var value = req.query.value;
  if(value){
    db.query(`SELECT creater,COUNT(*) FROM log_table WHERE logTime LIKE '${value}%' GROUP BY creater`,(error,data)=>{
      if(error){
        res.send(JSON.stringify({code:"E",msg:error}));
        res.end()
      }else{
        res.send(JSON.stringify({code:'S',data:data}));
        res.end()
      }
    })
  }
})

/**
 * 通过ID删除一篇日志
 */
router.get('/method/deleteLog',(req,res)=>{
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
router.get('/method/queryAllSubItem',(req,res)=>{
  var sqlString = '';
  if(req.session.user === 'admin'){
    sqlString = `SELECT * FROM sub_menu_item`;
  }else{
    sqlString = `SELECT * FROM sub_menu_item WHERE parent!='系统管理'`;
  }
  db.query(sqlString,(error,data)=>{
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
router.get('/method/queryStaffComment',(req,res)=>{
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
router.post('/method/submitStaffComment',(req,res)=>{
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
router.get('/method/querySubmitComment',(req,res)=>{
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
router.get('/method/queryDepartment',(req,res)=>{
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
router.get('/method/queryAllUsers',(req,res)=>{
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
router.post('/method/saveNewLoginUser',(req,res)=>{
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
router.post('/method/deleteOldUser',(req,res)=>{
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
router.get('/method/queryAllStaff',(req,res)=>{
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
router.get('/method/getUserBaseInfo',(req,res)=>{
  res.send({code:'S',data:req.session.user})
})

/**
 * 修改密码
 */
router.post('/method/changePassword',(req,res)=>{
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
router.post('/method/fileUpload',function(req,res) {
  var newName = path.parse(req.files[0].originalname).ext;
  fs.rename(path.join(__dirname,"../public/upload",req.files[0].filename),path.join(__dirname,"../public/upload/satin",req.files[0].filename+newName),(err)=>{
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
router.post('/method/deleteSatinFile',function(req,res) {
  var src = req.body.src;
  fs.unlink(path.join(__dirname,'../public/upload/satin',src),(error)=>{
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
router.post('/method/submitSatin',(req,res)=>{
  let content = req.body.content,
  src = req.body.src,
  time = req.body.time;
  db.query(`INSERT INTO net_satin (content,src,author,time) VALUES ('${content}','${src}','${req.session.user}','${time}')`,(error,data)=>{
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
router.get('/method/querySubmitNetSatin',(req,res)=>{
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
router.post('/method/starSatin',(req,res)=>{
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
router.post('/method/shitSatin',(req,res)=>{
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
router.get('/method/requestAgainSatin',(req,res)=>{
  let page = req.query.page;
  if(page<=0){
    res.send(JSON.stringify({code:'S',data:[]}));
    return false;
  }else{
    db.query(`SELECT ID,content,src,star,shit FROM net_satin ORDER BY ID DESC LIMIT ${(page-1)*10},10`,(error,data2)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
      }else{
        if(req.session.user === 'admin'){
          res.send(JSON.stringify({code:"SA",data:data2}));
        }else{
          res.send(JSON.stringify({code:"S",data:data2}));
        }
      }
    })
  }
})

/**
 * 删除一个段子
 */
router.post('/method/deleteSatin',(req,res)=>{
  let value = req.body.value;
  if(req.session.user!=='admin'){
    res.send(JSON.stringify({code:'E',msg:'你没有足够的权限删除'}));
  }else{
    db.query(`DELETE FROM net_satin WHERE ID=${value}`,(error,data2)=>{
      if(error){
        res.send(JSON.stringify({code:'E',msg:error}));
      }else{
        res.send(JSON.stringify({code:"S"}));
      }
    })
  }
})

/**
 * 上传团建的图片
 */
router.post('/method/upLoadTeamPicture',function(req,res) {
  var newName = path.parse(req.files[0].originalname).ext;
  fs.rename(path.join(__dirname,"../public/upload",req.files[0].filename),path.join(__dirname,"../public/upload/teamBuild",req.files[0].filename+newName),(err)=>{
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
router.post('/method/deleteTeamFile',function(req,res) {
  var src = req.body.src;
  fs.unlink(path.join(__dirname,'../public/upload/teamBuild',src),(error)=>{
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
router.post('/method/submitTeamBuild',function(req,res){
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
router.get('/method/queryTeamBuild',(req,res)=>{
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
router.post('/method/joinTeamBuild',(req,res)=>{
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
          res.send(JSON.stringify({code:'E',msg:'你已参与过该活动'}));
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
 * 执行爬虫获取网页内容
 */
router.get('/method/startSpiderText',(req,res)=>{
  /**
   * 抓取百思不得姐的文字段子
   */
  request('http://www.budejie.com/text/',(error,response,body)=>{
    if(!error && response.statusCode == 200){
      var JQ = cheerio.load(body);
      var content = JQ('.j-r-list-c-desc');
      var length = content.length;
      var index = 0;
      async.each(content,function(item, callback) {
        var i = index++;
        var text = (JQ('.j-r-list-c-desc').eq(i).text()).trim();
        var time = (JQ('.u-time').eq(i).text()).trim()+'text';
        db.query(`SELECT * FROM net_satin WHERE time='${time}'`,(error,data)=>{
          callback(error)
          if(data.length == 0){
            db.query(`INSERT INTO net_satin (content,author,time) VALUES ('${text}','budejie','${time}')`,function(error, tags, fields){
              if(error){
                callback(error)
                return false;
              }
            })
          }
        })
      }, function(error,i) {
        if(error){
          res.end(JSON.stringify({code:'E',msg:error}));
          return false;
        }
        res.end(JSON.stringify({code:'S'}));
      });
    }
  })
})
router.get('/method/startSpiderPic',(req,res)=>{
  /**
   * 抓取百思不得姐的图片段子
   */
  request('http://www.budejie.com/pic/',(error,response,body)=>{
    if(!error && response.statusCode == 200){
      var JQ = cheerio.load(body);
      var content = JQ('.j-r-list-c');
      var length = content.length;
      var index = 0;
      async.each(content,function(item, callback) {
        var i = index++;
        var html = escapeCode((JQ('.j-r-list-c').eq(i).html()).trim());
        var time = (JQ('.u-time').eq(i).text()).trim()+'pic';
        db.query(`SELECT * FROM net_satin WHERE time='${time}'`,(error,data)=>{
          callback(error)
          if(data.length == 0){
            db.query(`INSERT INTO net_satin (content,author,time) VALUES ('${html}','budejie','${time}')`,function(error, tags, fields){
              if(error){
                callback(error)
                return false;
              }
            })
          }
        })
      }, function(error,i) {
        if(error){
          res.end(JSON.stringify({code:'E',msg:error}));
          return false;
        }
        res.end(JSON.stringify({code:'S'}));
      });
    }
  })
})
module.exports = router;