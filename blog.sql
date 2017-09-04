/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50635
Source Host           : localhost:3306
Source Database       : blog

Target Server Type    : MYSQL
Target Server Version : 50635
File Encoding         : 65001

Date: 2017-09-04 16:14:58
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `article_css`
-- ----------------------------
DROP TABLE IF EXISTS `article_css`;
CREATE TABLE `article_css` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `author` varchar(32) DEFAULT NULL,
  `articleDate` varchar(32) DEFAULT NULL,
  `article` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article_css
-- ----------------------------
INSERT INTO `article_css` VALUES ('19', 'qwe', 'qwe', 'qwe', '2017-08-26', 'we');
INSERT INTO `article_css` VALUES ('20', 'asd', 'sad', 'sd', '2017-08-13', 'asd');
INSERT INTO `article_css` VALUES ('22', 'ds', 'dq', 'q', '2017-08-12', 'we');
INSERT INTO `article_css` VALUES ('23', '2', '2', '2', '2017-08-06', '2');
INSERT INTO `article_css` VALUES ('24', '3', '3', '3', '2017-08-05', '3');
INSERT INTO `article_css` VALUES ('25', '1', '2', '1', '2017-08-04', '23');
INSERT INTO `article_css` VALUES ('26', '12', '12', '12', '2017-08-12', '23');
INSERT INTO `article_css` VALUES ('27', 's', 'ds', 'sd', '2017-08-19', '23');
INSERT INTO `article_css` VALUES ('30', '23', '454', '5454', '2017-08-06', '54');
INSERT INTO `article_css` VALUES ('31', '1', '2', '3', '2017-08-18', '3');
INSERT INTO `article_css` VALUES ('32', '2', '3', '3', '2017-08-20', 'qw');
INSERT INTO `article_css` VALUES ('33', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('34', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('35', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('36', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('37', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('38', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('39', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('40', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('41', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('42', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('43', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('44', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('45', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('46', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('47', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('48', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('49', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('50', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('51', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('52', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('53', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('54', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('55', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('56', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('57', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('58', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('59', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('60', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('61', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('62', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_css` VALUES ('208', 'ewqwe', 'ew', 'ewe', '2017-08-12', 'qwe');
INSERT INTO `article_css` VALUES ('209', 'ewcss', 'ew', 'ewe23', '2017-08-12', 'qwe');

-- ----------------------------
-- Table structure for `article_html`
-- ----------------------------
DROP TABLE IF EXISTS `article_html`;
CREATE TABLE `article_html` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `author` varchar(32) DEFAULT NULL,
  `articleDate` varchar(32) DEFAULT NULL,
  `article` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article_html
-- ----------------------------
INSERT INTO `article_html` VALUES ('20', 'asd', 'sad', 'sd', '2017-08-13', 'asd');
INSERT INTO `article_html` VALUES ('22', 'ds', 'dq', 'q', '2017-08-12', 'we');
INSERT INTO `article_html` VALUES ('23', '2', '2', '2', '2017-08-06', '2');
INSERT INTO `article_html` VALUES ('24', '3', '3', '3', '2017-08-05', '3');
INSERT INTO `article_html` VALUES ('25', '1', '2', '1', '2017-08-04', '23');
INSERT INTO `article_html` VALUES ('26', '12', '12', '12', '2017-08-12', '23');
INSERT INTO `article_html` VALUES ('27', 's', 'ds', 'sd', '2017-08-19', '23');
INSERT INTO `article_html` VALUES ('30', '23', '454', '5454', '2017-08-06', '54');
INSERT INTO `article_html` VALUES ('31', '1', '2', '3', '2017-08-18', '3');
INSERT INTO `article_html` VALUES ('32', '2', '3', '3', '2017-08-20', 'qw');
INSERT INTO `article_html` VALUES ('33', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('34', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('35', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('36', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('37', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('38', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('39', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('40', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('41', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('42', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('43', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('44', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('45', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('46', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('47', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('48', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('49', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('51', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('53', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('55', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('56', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('57', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('58', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('59', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_html` VALUES ('171', 'ew', 'ew', 'ewe', '2017-08-12', 'qwe');
INSERT INTO `article_html` VALUES ('172', 'ew', 'ew', 'ewe', '2017-08-12', 'qwe');
INSERT INTO `article_html` VALUES ('173', 'ew', 'ew', 'ewe', '2017-08-12', 'qwe');
INSERT INTO `article_html` VALUES ('174', 'ewsdsd', 'ew', 'ewe', '2017-08-12', 'qwe');
INSERT INTO `article_html` VALUES ('175', 'ewhtml', 'ew', 'ewe', '2017-08-12', 'qwe');

-- ----------------------------
-- Table structure for `article_js`
-- ----------------------------
DROP TABLE IF EXISTS `article_js`;
CREATE TABLE `article_js` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `author` varchar(32) DEFAULT NULL,
  `articleDate` varchar(32) DEFAULT NULL,
  `article` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=210 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article_js
-- ----------------------------
INSERT INTO `article_js` VALUES ('19', 'qwe', 'qwe', 'qwe', '2017-08-26', 'we');
INSERT INTO `article_js` VALUES ('20', 'asd', 'sad', 'sd', '2017-08-13', 'asd');
INSERT INTO `article_js` VALUES ('22', 'ds', 'dq', 'q', '2017-08-12', 'we');
INSERT INTO `article_js` VALUES ('23', '2', '2', '2', '2017-08-06', '2');
INSERT INTO `article_js` VALUES ('24', '3', '3', '3', '2017-08-05', '3');
INSERT INTO `article_js` VALUES ('25', '1', '2', '1', '2017-08-04', '23');
INSERT INTO `article_js` VALUES ('26', '12', '12', '12', '2017-08-12', '23');
INSERT INTO `article_js` VALUES ('27', 's', 'ds', 'sd', '2017-08-19', '23');
INSERT INTO `article_js` VALUES ('30', '23', '454', '5454', '2017-08-06', '54');
INSERT INTO `article_js` VALUES ('31', '1', '2', '3', '2017-08-18', '3');
INSERT INTO `article_js` VALUES ('32', '2', '3', '3', '2017-08-20', 'qw');
INSERT INTO `article_js` VALUES ('33', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('34', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('35', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('36', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('37', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('38', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('39', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('40', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('41', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('42', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('43', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('44', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('45', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('46', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('47', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('48', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('49', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('50', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('51', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('52', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('53', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('54', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('55', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('56', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('57', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('58', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('59', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('60', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('61', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('62', 'sd', 'sd', 'sd', '2017-08-20', 'asd');
INSERT INTO `article_js` VALUES ('208', 'ewqwe', 'ew', 'ewe', '2017-08-12', 'qwe');
INSERT INTO `article_js` VALUES ('209', 'ewjs', 'ew', 'ewe', '2017-08-12', 'qwe');

-- ----------------------------
-- Table structure for `department`
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `item` varchar(32) DEFAULT NULL,
  `item_code` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES ('1', '技术部', 'JSB');
INSERT INTO `department` VALUES ('2', '运营部', 'YYB');
INSERT INTO `department` VALUES ('3', '财务部', 'CWB');

-- ----------------------------
-- Table structure for `log_table`
-- ----------------------------
DROP TABLE IF EXISTS `log_table`;
CREATE TABLE `log_table` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `creater` varchar(32) NOT NULL,
  `logTime` varchar(32) DEFAULT NULL,
  `secret` varchar(16) DEFAULT NULL,
  `log` text,
  `deleter` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_table
-- ----------------------------
INSERT INTO `log_table` VALUES ('2', '韩璐璐', '2017-08-28', 'true', '312\n6456', null);
INSERT INTO `log_table` VALUES ('6', '门晓津', '2017-08-22', 'true', '', null);
INSERT INTO `log_table` VALUES ('8', '韩璐璐', '2017-08-28', 'true', '11', null);
INSERT INTO `log_table` VALUES ('9', '韩璐璐', '2017-08-28', 'true', '23', null);
INSERT INTO `log_table` VALUES ('10', '邵阿南', '2017-08-28', 'true', '213123', null);
INSERT INTO `log_table` VALUES ('11', '邵阿南', '2017-08-28', 'false', 'qwe', null);
INSERT INTO `log_table` VALUES ('13', '唐建国', '2017-08-28', 'true', '22', null);
INSERT INTO `log_table` VALUES ('14', '唐建国', '2017-08-28', 'false', '222', null);
INSERT INTO `log_table` VALUES ('15', '唐建国', '2017-08-28', 'true', '333', null);
INSERT INTO `log_table` VALUES ('16', '唐建国', '2017-08-28', 'false', '333', null);
INSERT INTO `log_table` VALUES ('17', '唐建国', '2017-08-28', 'true', '2323', null);
INSERT INTO `log_table` VALUES ('18', '唐建国', '2017-08-28', 'true', '323', null);
INSERT INTO `log_table` VALUES ('19', '唐建国', '2017-08-28', 'true', '2323', null);
INSERT INTO `log_table` VALUES ('20', '门晓津', '2017-08-28', 'true', '2323', null);
INSERT INTO `log_table` VALUES ('21', '门晓津', '2017-08-28', 'true', '2323', null);
INSERT INTO `log_table` VALUES ('22', '门晓津', '2017-08-28', 'false', '123', null);
INSERT INTO `log_table` VALUES ('24', '邵阿南', '2017-08-28', 'false', '12323', null);
INSERT INTO `log_table` VALUES ('26', '韩璐璐', '2017-08-28', 'false', '11', null);
INSERT INTO `log_table` VALUES ('27', '门晓津', '2017-08-28', 'false', '23', null);
INSERT INTO `log_table` VALUES ('28', '韩璐璐', '2017-08-29', 'true', '13', null);
INSERT INTO `log_table` VALUES ('29', '门晓津', '2017-08-29', 'false', '123123', null);
INSERT INTO `log_table` VALUES ('30', '唐建国', '2017-08-29', 'false', '1.这不是一个侦查后你等\n2.你很好 \n3.大街上了；卡萨丁卡 ', null);
INSERT INTO `log_table` VALUES ('32', '韩璐璐', '2017-08-29', 'false', '1.我最美\n2.我真美\n3.我好美', null);
INSERT INTO `log_table` VALUES ('33', '唐建国', '2017-08-29', 'false', '1.解决包装前台的首页图片缩放比例问题\n2.调整了首页模块的内容和布局', null);
INSERT INTO `log_table` VALUES ('34', '唐建国', '2017-08-30', 'false', '1.包装前台代码的优化及bug的修复\n2.学习NodeJS', null);
INSERT INTO `log_table` VALUES ('35', '唐建国', '2017-08-31', 'false', '学习NodeJS', null);
INSERT INTO `log_table` VALUES ('36', '唐建国', '2017-09-01', 'false', '1.学习NodeJS', null);

-- ----------------------------
-- Table structure for `menu_item`
-- ----------------------------
DROP TABLE IF EXISTS `menu_item`;
CREATE TABLE `menu_item` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `item` varchar(64) DEFAULT NULL COMMENT '主目录',
  `child` varchar(64) DEFAULT NULL COMMENT '判断是否有子目录',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of menu_item
-- ----------------------------
INSERT INTO `menu_item` VALUES ('1', '系统管理', 'true');
INSERT INTO `menu_item` VALUES ('31', '后端开发', 'true');
INSERT INTO `menu_item` VALUES ('37', '前端开发', 'true');
INSERT INTO `menu_item` VALUES ('40', '日志管理', 'true');
INSERT INTO `menu_item` VALUES ('41', '网络运维', 'true');
INSERT INTO `menu_item` VALUES ('42', '休闲娱乐', 'true');
INSERT INTO `menu_item` VALUES ('43', '与我相关', 'true');

-- ----------------------------
-- Table structure for `net_satin`
-- ----------------------------
DROP TABLE IF EXISTS `net_satin`;
CREATE TABLE `net_satin` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `content` text,
  `src` varchar(256) DEFAULT NULL,
  `author` varchar(32) DEFAULT NULL,
  `star` int(11) DEFAULT '0',
  `shit` int(11) DEFAULT '0',
  `time` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=271 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of net_satin
-- ----------------------------
INSERT INTO `net_satin` VALUES ('250', '今天经人介绍，安排了一次相亲，妹纸长的挺丰满，是我喜欢的类型，我们聊了一会，彼此还算投缘，后来我问她，你属啥的？妹纸说属猴的。我接着说，十二生肖与十二地支相对应，你知道与猴对应的地支是啥吗？妹纸笑着说，是申呗！于是为了表达我的爱慕之情，我兴奋的说，我喜欢申猴。妹纸愣了几秒钟，脸色立刻就变了，一把掌扇在我脸上，说了一句臭流氓，然后气冲冲的走了，我到底做错了什么？真是哭天天不应，哭地地不灵啊！', null, 'admin', '0', '0', '2017-09-04 11:56:01');
INSERT INTO `net_satin` VALUES ('251', '新交了一个女朋友，没想到她也玩LOL。更没想到她技术比我都好，有一次她打LOL的时候我要啪啪啪，在如此强烈外界因素的干扰下，结果两波兵她一刀都没漏，真厉害！', null, 'admin', '0', '0', '2017-09-04 13:56:02');
INSERT INTO `net_satin` VALUES ('252', '文字究竟有多大的魔力？据我调查，70％的男孩子开始人工摧毁的时候，都是因为不经意间，看到某些羞于启齿的关于啪啪啪的文字描述。而后他们逐渐深入，寻找图片、视频。当做到阅片无数，心中无码的境界时，他们的对于片儿的兴趣在逐渐流失，而后一般又会选择重回小书系列，这就是文字的魔力。', null, 'admin', '0', '0', '2017-09-04 09:59:54');
INSERT INTO `net_satin` VALUES ('253', '一次我在公测上厕所，看见手机很脏，我就一直用纸擦啊擦啊，把手机擦的特干净了，心里一个乐啊，突然我发现一个很恐怖的事，很恐怖。。。。', null, 'admin', '0', '0', '2017-09-04 06:56:01');
INSERT INTO `net_satin` VALUES ('254', '最近和女神聊天，基本都是问一句答一句，有晚上聊晚了，女神发来三个字母“CNM”，本着看不懂就开房的精神，立马穿上裤子开房去，姐夫们祝我成功吧！', null, 'admin', '0', '0', '2017-09-04 03:56:02');
INSERT INTO `net_satin` VALUES ('255', '和二货同事聊天，聊到回家坐车的问题，他说汽车太慢了，要有飞机就好了。 我说飞机也慢，你要会瞬移就好了。他回了句：我要会瞬移谁还在这上班啊！我问他：那你准备干啥？没想到这货说：我去给人送快递！………瞬间一道天雷正中我眉心，把我雷的外焦里嫩啊！你特么都会瞬移了能不能干点大事？纯屌丝……', null, 'admin', '0', '0', '2017-09-03 22:56:02');
INSERT INTO `net_satin` VALUES ('256', '肚子坏了！从昨夜到现在都拉了十次了，拉的腿都软了。我和女友说：估计昨晚吃了什么不干净的东西……女友哇的一声哭了：我就知道你嫌弃我，分手吧！像你这样的老实人一定会找到干净的！我……这哪跟哪呀！', null, 'admin', '0', '0', '2017-09-03 20:56:02');
INSERT INTO `net_satin` VALUES ('257', '刚刚看西游记中真假孙悟空那一集，那两个孙悟空为了证明自己，找了阎王找如来，我就不明白了，他们直接证明谁手中的金箍棒能变大变小不完了吗？毕竟只有一根定海神针，他们难道都没想到吗？', null, 'admin', '0', '0', '2017-09-03 17:56:01');
INSERT INTO `net_satin` VALUES ('258', '一家店铺开张，既无招牌也无名号，只在橱窗内摆了一个精美的古董钟。一日，一位男士走进来，要求修手表。“对不起！这里不是钟表店。”老板说，“我们是隔壁那家医院的分院，专门做痔疮手术。”男士不解的问：“既不是钟表店，干吗橱窗摆古董钟呢？”老板盯着他说：“那你说我们该在橱窗摆什么？屁股吗？”', null, 'admin', '0', '0', '2017-09-03 19:32:51');
INSERT INTO `net_satin` VALUES ('259', '老婆怀孕了，憋的难受，总想出去找个小姐放一下。又怕老婆生气，就和老婆说了。老婆非但没生气，还把她闺蜜叫来了。一阵云雨后，抽着烟问老婆的闺蜜:你老公不知道吧？老婆闺蜜:不用怕，没事~我怀孕那时候，你老婆也是帮了忙的。', null, 'admin', '0', '0', '2017-09-03 15:56:02');
INSERT INTO `net_satin` VALUES ('260', '打KFC叫外卖，从十二点打到一点，电话里一直在说占线中……朋友饿的实在不行了，拿过电话，按了English service…等待…通了！朋友第一句话就是：Can you speak Chinese？对方一愣，回答：yes！然后这货就模仿老外的口音用中文问：那卧能泳种文电餐吗？回答：可以！于是点餐成功！', null, 'admin', '0', '0', '2017-09-02 20:56:01');
INSERT INTO `net_satin` VALUES ('261', '儿子上小学不到一个星期就跟同桌干了一仗，矛盾的起源是两人争论一天三顿饭还是一天两顿饭，各执一词互不相让。后来知道真相的儿子含着泪对着我跟媳妇说：“六年了，六年啊！我活了六年才知道这世界上还有一顿饭叫“早餐！”', null, 'admin', '0', '0', '2017-09-03 09:58:02');
INSERT INTO `net_satin` VALUES ('262', '我就不明白了电视里古代那些大侠一出去就是两斤酱牛肉一壶好酒 每天最少三顿…… 放眼前 二斤酱牛肉90块钱 一壶酒就算十块钱 一月小一万 我真想问他们都是做什么工作的…', null, 'admin', '0', '0', '2017-09-03 09:11:04');
INSERT INTO `net_satin` VALUES ('263', '去ATM取款机取钱，它居然吐出来一张有洞的钱，我想了想又按了存款键，哎呦！它竟然不要！你自己吐的你不要，你还要脸不？', null, 'admin', '0', '0', '2017-09-03 06:56:02');
INSERT INTO `net_satin` VALUES ('264', '下辈子我一定要做个男人，因为做女人，不能太胖，不能太瘦，不能长斑,不能长痘，不能拜金，不能贪玩。 要生孩子，要漂亮，要懂事 ，要身材好。要会煮饭，要做家务，要懂得体谅，要不黏人，要勤劳大方，要温柔贤惠，要照顾老人，要教育小孩,要勤俭持家,要挣钱养家,总之得各种会！而男人,只要会挣钱就好! 但是很可惜，以上那些，我都占了~', null, 'admin', '0', '0', '2017-09-03 13:56:02');
INSERT INTO `net_satin` VALUES ('265', '下雨了，我心情和天气一样阴暗低落，独自在城市的我看透了人间的冷漠…我沉浸在自己的思绪中，任凭一辆辆公交车驶过……“先生，有没有2元钱？”一个乞丐出现在面前轻声问我。我没好气的说：“没有！”他微笑着从瓷碗里拿出2元给我；“看你等了好久没上车，估计忘带钱了，雨一时停不了，赶快回家吧。”', null, 'admin', '2', '0', '2017-09-03 11:56:01');
INSERT INTO `net_satin` VALUES ('266', '我和同学都有非常忙碌的父亲。同学：爸爸，你一天赚多少钱呀？父亲：大概1000元吧，怎么了？同学：爸爸，这是我存很久的1000元，今天可以陪我一天吗？父亲红了眼眶，父子相拥而泣，重获天伦之乐。我听了之后，也决定效仿同学！我：爸爸，你一天赚多少钱呀？父亲：10万左右吧，怎么了？我：没事呀。。。我就随便问问。。。', null, 'admin', '0', '0', '2017-09-02 13:56:02');
INSERT INTO `net_satin` VALUES ('267', 'KTV里，音乐一首接一首的放着，小姐一直紧紧握住双目失明男子的手...男子说道：“姑娘，一个小时了，你一句话也不说，也是第一次吧！我给你讲个故事吧！我有一个女儿，从小就要强，靠自己的努力考上了大学，现在出国了，每个月都寄钱给我，是我一生的骄傲...”听完男子的话，小姐的手握的更紧了……', null, 'admin', '0', '0', '2017-09-02 15:56:02');
INSERT INTO `net_satin` VALUES ('268', '年轻人：我的信，你有没有交给你姐姐？孩子：我姐姐不在家，我交给我爸爸了。年轻人：哇！那你爸爸怎么说呢？孩子：我爸很生气，叫我退还给你。年轻人：那我的信呢？孩子：去了你家你不在家，又交给你爸爸了。年轻人：你说什么？', null, 'admin', '0', '0', '2017-09-02 17:56:01');
INSERT INTO `net_satin` VALUES ('269', '今天和女友开房，一起洗澡的时候她突然问我：“怎么你们男生洗澡都是先把沐浴露往肚子上涂呢？”我愣了几秒钟，坦诚地回答：“我也不知道为什么。”姐夫们，有知道的吗？', null, 'admin', '0', '0', '2017-09-02 22:56:02');
INSERT INTO `net_satin` VALUES ('270', '这社会，女的照相照胸，男的照相照车，谁知道胸是不是挤的，车是不是你的。 这年头，有纹身的都怕热，用苹果的都没兜，带手表的爱拍腿，镶金牙的爱咧嘴。 现如今，没结婚的像结婚的一样同居，结婚的像没结婚的一样分居。动物像人一样穿衣服，人像动物一样露着肉。小孩子像大人一样成熟，大人像小孩子一样幼稚。女人像男人一样爷们，男人像女人一样娘们。没钱的像有钱的一样装富，有钱的像没钱的一样装穷。情人像夫人一样四处招摇，夫人像情人一样深入简出。 网上说：现在存折里不到百万的，不叫存款，叫余额。审视了一下自己，原来，自己的那点只能叫手续费，有时候连手续费都不足。 慢慢明白了，戴三百块的表和三百万的表，时间是一样的； 喝三十块的酒和三千块的酒，呕吐是一样的；住三十平米的房和三百平米的房，孤独是一样的。 总有一天你会知道，你内心真正的快乐，是物质世界永远给予不了的…抽十块的烟和抽100块的烟都会得肺癌，坐头等舱和坐经济舱失联了一样都回不来... 所以，想明白了，知足常乐...', '31ed1a51c06c9db5ec1e1c4a16783247.jpg', 'admin', '0', '0', '2017-09-04 15:31:20');

-- ----------------------------
-- Table structure for `staff`
-- ----------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `name_code` varchar(32) DEFAULT NULL,
  `department` varchar(32) DEFAULT NULL,
  `sex` varchar(16) DEFAULT NULL,
  `age` varchar(16) DEFAULT NULL,
  `phone` varchar(32) DEFAULT NULL,
  `address` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of staff
-- ----------------------------
INSERT INTO `staff` VALUES ('16', '唐建国', 'tangjg', null, null, null, null, null);
INSERT INTO `staff` VALUES ('17', '韩璐璐', 'hanll', null, null, null, null, null);
INSERT INTO `staff` VALUES ('18', '门晓津', 'menxj', null, null, null, null, null);
INSERT INTO `staff` VALUES ('21', '邵阿南', 'shaoanan', null, null, null, null, null);

-- ----------------------------
-- Table structure for `staff_comment`
-- ----------------------------
DROP TABLE IF EXISTS `staff_comment`;
CREATE TABLE `staff_comment` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `item` varchar(32) DEFAULT NULL,
  `item_choose` varchar(500) DEFAULT NULL,
  `item_code` varchar(32) DEFAULT NULL,
  `item_scale` int(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of staff_comment
-- ----------------------------
INSERT INTO `staff_comment` VALUES ('1', '团队意识', 'A-非常好，时刻关心团队荣誉;B-较好，偶尔关注到团队荣誉;C-一般，对团队荣誉不上心，表现平平;D-较差，只关心自己的工作，不关心团队整体目标', 'TDYS', '20');
INSERT INTO `staff_comment` VALUES ('2', '合群', 'A-为人好相处，能非常好的处理同事关系;B-相处还可以，没出现过冲突;C-待人一般，比较冷，但还能沟通;D-待人斤斤计较、难以沟通，经常与同事产生矛盾', 'HQ', '10');
INSERT INTO `staff_comment` VALUES ('3', '接受任务态度', 'A-诚恳，积极接受任务，并圆满完成;B-照任务办事，能较好完成;C-总有推辞的理由，勉强完成各项任务;D-接受任务，但不执行', 'JSRWZT', '15');
INSERT INTO `staff_comment` VALUES ('4', '工作热情', 'A-非常积极热情，跟打鸡血一样;B-有热情，会主动去协调工作问题;C-一般，别人请求支持时会予以帮助;D-较差，只有别人催促才会执行', 'GZRQ', '10');
INSERT INTO `staff_comment` VALUES ('5', '责任感', 'A-非常积极负责，并主动帮别人;B-对工作较负责，出现问题会认真解决;C-问题虽解决，但只解决了问题，不够认真;D-只解决眼前问题，对自己的工作不负责任', 'ZRG', '10');
INSERT INTO `staff_comment` VALUES ('6', '纪律性', 'A-认真遵守各项纪律，时刻约束自己;B-较好，会约束自己的行为;C-一般，只关注完成任务，不在关心纪律;D-较差，迟到、早退，中间外出偷懒等违反纪律的行为', 'JLX', '15');
INSERT INTO `staff_comment` VALUES ('7', '进取性', 'A-积极进去，主动学习，每天都努力提升自己;B-较好，会学习新知识，但不够持之以恒;C-一般，需要用到的知识，会去学习;D-较差，故步自封，对新的知识、理念不接受', 'JQX', '5');
INSERT INTO `staff_comment` VALUES ('8', '性格', 'A-开朗活泼;B-时而冷静，时而活泼;C-沉着冷静;D-不算开朗、也不算冷静', 'XG', '5');
INSERT INTO `staff_comment` VALUES ('9', '兴趣爱好', 'A-爱好广泛，业余活动多;B-爱好一般，但有些爱好;C-爱好不多，喜欢宅;D-宅男/宅女', 'XQAH', '5');
INSERT INTO `staff_comment` VALUES ('10', '仪表仪容', 'A-穿着大方得体，注意干净和个人仪态，办公干净整洁;B-衣着礼仪较好，办公整洁;C-有时着装不整洁，不注意形象;D-邋遢，衣冠不整，不注意文明卫生，用语不文明', 'YBYR', '5');

-- ----------------------------
-- Table structure for `staff_submit_comment`
-- ----------------------------
DROP TABLE IF EXISTS `staff_submit_comment`;
CREATE TABLE `staff_submit_comment` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `GZRQ` varchar(8) DEFAULT NULL,
  `HQ` varchar(8) DEFAULT NULL,
  `JLX` varchar(8) DEFAULT NULL,
  `JQX` varchar(8) DEFAULT NULL,
  `JSRWZT` varchar(8) DEFAULT NULL,
  `TDYS` varchar(8) DEFAULT NULL,
  `XG` varchar(8) DEFAULT NULL,
  `XQAH` varchar(8) DEFAULT NULL,
  `YBYR` varchar(8) DEFAULT NULL,
  `ZRG` varchar(8) DEFAULT NULL,
  `departmentValue` varchar(16) DEFAULT NULL,
  `staffValue` varchar(16) DEFAULT NULL,
  `others` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of staff_submit_comment
-- ----------------------------
INSERT INTO `staff_submit_comment` VALUES ('1', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'C', 'D', 'JSB', 'hanll', '注意点');
INSERT INTO `staff_submit_comment` VALUES ('5', '', '', '', '', '', '', '', '', '', '', 'YYB', 'hanll', '');
INSERT INTO `staff_submit_comment` VALUES ('6', '', '', '', '', '', 'B', '', '', '', '', 'YYB', 'shaoanan', '');
INSERT INTO `staff_submit_comment` VALUES ('7', 'C', 'B', 'C', 'C', 'B', 'C', 'C', 'A', 'B', 'C', 'JSB', 'tangjg', '测试');
INSERT INTO `staff_submit_comment` VALUES ('8', 'C', 'C', 'C', 'B', 'D', 'B', 'C', 'B', 'D', 'A', 'JSB', 'tangjg', '还是测试');

-- ----------------------------
-- Table structure for `sub_menu_item`
-- ----------------------------
DROP TABLE IF EXISTS `sub_menu_item`;
CREATE TABLE `sub_menu_item` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `parent` varchar(32) NOT NULL COMMENT '父元素',
  `item` varchar(32) NOT NULL COMMENT '子元素',
  `path` varchar(64) DEFAULT NULL COMMENT '链接地址',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sub_menu_item
-- ----------------------------
INSERT INTO `sub_menu_item` VALUES ('18', '系统管理', '新增模块', '/addModule');
INSERT INTO `sub_menu_item` VALUES ('20', '系统管理', '模块管理', '/manageModule');
INSERT INTO `sub_menu_item` VALUES ('27', '后端开发', 'NodeJS', '/manageNodeJS');
INSERT INTO `sub_menu_item` VALUES ('34', '前端开发', 'HTML', '/manageHtml');
INSERT INTO `sub_menu_item` VALUES ('35', '前端开发', 'CSS', '/manageCss');
INSERT INTO `sub_menu_item` VALUES ('36', '前端开发', 'JavaScript', '/manageJs');
INSERT INTO `sub_menu_item` VALUES ('38', '日志管理', '新建日志', '/addLog');
INSERT INTO `sub_menu_item` VALUES ('39', '日志管理', '日志查询', '/logQuery');
INSERT INTO `sub_menu_item` VALUES ('40', '后端开发', 'JAVA', '/manageJava');
INSERT INTO `sub_menu_item` VALUES ('41', '网络运维', 'OA部署', '/manageOA');
INSERT INTO `sub_menu_item` VALUES ('42', '网络运维', 'Linux', '/manageLinux');
INSERT INTO `sub_menu_item` VALUES ('44', '休闲娱乐', '员工互评', '/staffComment');
INSERT INTO `sub_menu_item` VALUES ('45', '休闲娱乐', '游戏推荐', '/gameRecommend');
INSERT INTO `sub_menu_item` VALUES ('46', '休闲娱乐', '网络段子', '/netSatin');
INSERT INTO `sub_menu_item` VALUES ('47', '休闲娱乐', '团队建设', '/teamBuild');
INSERT INTO `sub_menu_item` VALUES ('48', '系统管理', '用户管理', '/manageUser');
INSERT INTO `sub_menu_item` VALUES ('50', '与我相关', '悄悄话', '/privateChat');
INSERT INTO `sub_menu_item` VALUES ('51', '与我相关', '密码修改', '/changePassword');
INSERT INTO `sub_menu_item` VALUES ('53', '系统管理', '定时任务', '/startSchedule');

-- ----------------------------
-- Table structure for `team_build`
-- ----------------------------
DROP TABLE IF EXISTS `team_build`;
CREATE TABLE `team_build` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(128) DEFAULT NULL,
  `sub_address` varchar(256) DEFAULT NULL,
  `src` varchar(256) DEFAULT NULL,
  `src_desc` varchar(128) DEFAULT NULL,
  `src_sub_desc` varchar(256) DEFAULT NULL,
  `time` varchar(128) DEFAULT NULL,
  `detail_desc` varchar(516) DEFAULT NULL,
  `join_num` int(11) DEFAULT '0',
  `creater` varchar(128) DEFAULT NULL,
  `join_name` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of team_build
-- ----------------------------

-- ----------------------------
-- Table structure for `user_table`
-- ----------------------------
DROP TABLE IF EXISTS `user_table`;
CREATE TABLE `user_table` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(256) NOT NULL DEFAULT '',
  `src` varchar(64) DEFAULT NULL,
  `role` varchar(32) DEFAULT NULL,
  `creater` varchar(32) DEFAULT NULL,
  `user` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_table
-- ----------------------------
INSERT INTO `user_table` VALUES ('1', 'admin', '81eaaba8c59f8b3c5d2907c03621f084', null, null, null, null);
INSERT INTO `user_table` VALUES ('25', 'tangjg', '646d5922adf412c1d65c0c5aa96345ba', null, '用户', 'admin', '唐建国');
INSERT INTO `user_table` VALUES ('26', 'hanll', '81eaaba8c59f8b3c5d2907c03621f084', null, '用户', 'admin', '韩璐璐');
INSERT INTO `user_table` VALUES ('27', 'menxj', '81eaaba8c59f8b3c5d2907c03621f084', null, '用户', 'admin', '门晓津');
INSERT INTO `user_table` VALUES ('30', 'shaoanan', '81eaaba8c59f8b3c5d2907c03621f084', null, '用户', 'admin', '邵阿南');
