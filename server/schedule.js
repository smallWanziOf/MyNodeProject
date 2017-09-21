var schedule = require("node-schedule");
var request = require('request');
var cheerio = require('cheerio');
const {db} = require('../router/dbConfig.js');
var async = require('async');

function escapeCode(value){
  if(typeof value === "string"){
    return value.replace(/'/g,' &#039 ').replace(/"/g,' &quot ');
  }else{
    alert("This Project has a problem ! please connect Admin, Sorry!!!");
    loginExpires()
  }
}

var rule = new schedule.RecurrenceRule();
rule.minute = 30;
var j = schedule.scheduleJob(rule, function(){
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
      });
    }
  })

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
      });
    }
  })

});
module.exports = {schedule,j};