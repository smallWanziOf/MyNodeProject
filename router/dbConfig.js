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
module.exports = {db};