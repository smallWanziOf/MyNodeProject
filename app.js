//express_demo.js 文件
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var path = require("path");
var cookieParser = require("cookie-parser");
var birds = require('./router');

const urlencodedParser = bodyParser.urlencoded({extended:false})
const multerObj = multer({dest:'upload'});

app.use(multerObj.any());
app.use(cookieParser());

app.use(express.static('public'));

app.get('/process_get',function(req,res){
  res.send(JSON.stringify(req.query));
})

app.post('/process_post',urlencodedParser,function(req,res){
  console.log(req.body)
  res.send(JSON.stringify(req.body))
})

app.post('/file_upload',function(req,res) {
  var newName = req.files[0].filename + path.parse(req.files[0].originalname).ext;
  console.log( req.files[0])
  fs.rename(path.join(__dirname,"/upload",req.files[0].filename),path.join(__dirname,"/upload",req.files[0].originalname),(err)=>{
    if(err)
      console.log(err);
    res.end();
  });
})

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

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})