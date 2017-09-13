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

module.exports = {md5,verifysign,hashValue};
