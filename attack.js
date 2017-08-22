var express = require('express');
var app = express();
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');
var page = 20;

function start(page){
  superagent
  .get(`http://www.cnblogs.com/#p${page}`)
  .end((err,res)=>{
      //var $ = cheerio.load(res.body);
      console.log(res.body)
      /*fs.writeFile(`${__dirname}/txt/${page}.txt`,$('.post_item_body').html(),(error)=>{
        if(error) throw error
      })*/
  })
}

start(1)

app.listen(3030);