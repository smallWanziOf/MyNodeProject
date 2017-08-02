# 项目中遇到的问题
## react-router(^4.0)
### 项目开发初期无意间安装了react-router4.0以上的版本，接着就是各种踩坑历程所以希望在md中把所有遇到的坑都罗列出来将来在学习的时候会发现当初的自己是多么的幼稚和坚强
#### 1.关于4.0版本中四种关于路由的解释我就不说了，因为在百度中有很多这样的解释官网也有解释。
#### 2.我们来说一个官网推荐的<BrowserRouter>，很遗憾这个标签并没有history属性让你去配置所以导致每次刷新页面的时候会404，cannot find！这个问题纠结了整整一个下午，但是如果使用<HashRouter>就不会出现刷新界面丢失文件的情况.
#### 3.针对上面的问题终于在一下午加一个早上的时间找到了算是唯一的出路，之前也是各种Stack Overflow, CSDN, Segmentfault, 简书。。。等等各大网站，最终还是有收获的，初期解决了一级路由的情况"localhost:8010/user",但是发现在多级路由的时候就GG了，提示"Uncaught SyntaxError: Unexpected token <"由于这个错实在是太广泛了，根本找不到突破口，但是神奇的百度最终还是帮我解决了困难。
#### 4.前端配置：index.html 中src地址引入<a href="https://segmentfault.com/a/1190000008777307">src配置</a>采用绝对路径的方式。后台配置（我的后台的Node）当文件是404的时候发送public/index.html这样 res.writeHead(200, {'Content-type': 'text/html','Connection':'keep-alive'});res.end(data);<a href="http://www.cnblogs.com/YZH-chengdu/p/6855237.html">Node配置</a>
#### 5.以上就是最基本的配置缺一不可。