reserveLoad.js
===========

**Dynamic JavaScript/CSS loader, and load JavaScript with reserve URL.**

reserveLoad.js 能从多个备用网址逐步加载JS文件。比如使用Google CDN资源时，有时可能因为网络问题Google CDN不可用，就自动从备用的Sina CDN加载，如果仍然连接失败，就从服务器自身加载...

可以设定多个JS文件及他们各自的备用加载网址，当所有JS文件加载完毕，会自动运行回调函数。

### Browser Support
---------------
  * IE 7+
  * Opera 10+
  * Safari 3+
  * Chrome 9+
  * Firefox 2+

### Who Used

 + AngularJS中文社区：[http://angularjs.cn/]()

### Examples

    <html>
        <head>
            <script src="/pathTo/reserveLoad.min.js"></script>
        </head>
        <body>
            <h1>reserveLoad.js</h1>
            <script>
            reserveLoad(
                ['mainUrl/jquery.js', 'reserveUrl1/jquery.js', 'reserveUrl2/jquery.js', 'jQuery'],
                ['mainUrl/angular.js', 'reserveUrl1/angular.js', 'reserveUrl2/angular.js', 'angular'],
                function (errUrl, jq, ng) {
                    alert('synchronous loaded!');
                    console.log(errUrl, jq, ng);
                });
            </script>
        </body>
    </html>


### Exhaustive list of ways to use reserveLoad.js

    reserveLoad('foo1.js', 'foo2.js', 'foo3.js', 'foo4.js', ...);

    reserveLoad('foo1.js', 'foo2.js', 'foo3.js', 'foo4.js' ...,  function (err, foo1, foo2, ...) {});

    reserveLoad(
        ['url1/foo1.js', 'url2/foo1.js', 'url3/foo1.js',..., 'methodInFoo1'],
        ['url1/foo2.js', 'url2/foo2.js', 'url3/foo2.js',..., 'methodInFoo2'],
        ..., callBack);
