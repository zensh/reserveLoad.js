reserveLoad.js
===========

**Load Javascript with reserve URL by asynchronous or synchronism**

reserveLoad.js 能从多个备用网址异步加载JS文件。比如使用Google CDN资源时，有时可能因为网络问题Google CDN不可用，就自动从备用的Sina CDN加载，如果仍然连接失败，就从服务器自身加载...

可以设定多个JS文件及他们各自的备用加载网址，当所有JS文件加载完毕，会自动运行回调函数。

还可设定同时异步加载或者按照顺序逐步加载。

### Examples ###

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
                function () {
                    alert('synchronism loaded!');
                });
            </script>
        </body>
    </html>

Demo请参考test目录下的index.html。

reserveLoad.min.js的体积是如此之小（1.12 KB），可以直接嵌入到html中。


### Exhaustive list of ways to use reserveLoad.js ###

synchronism, load by order

    reserveLoad(['foo1.js'], ['foo2.js'], ['foo3.js'], ['foo4.js'], ...);

asynchronous, no order

    reserveLoad.async(['foo1.js'], ['foo2.js'], ['foo3.js'], ['foo4.js'], ...);

synchronism, load by order, run allLoadedCallBack after all js loaded.

    reserveLoad(['foo1.js'], ['foo2.js'], ['foo3.js'], ...,  function allLoadedCallBack() {});

asynchronous, no order, run allLoadedCallBack after all js loaded.

    reserveLoad.async(['foo1.js'], ['foo2.js'], ['foo3.js'], ..., allLoadedCallBack);

synchronism, load by order, with some reserve url, run allLoadedCallBack after all js loaded.when load with reserve url, a method in js must be declared to detect js is loaded or false, such as 'methodInFoo1'

    reserveLoad(
        ['url1/foo1.js', 'url2/foo1.js', 'url3/foo1.js',..., 'methodInFoo1'],
        ['url1/foo2.js', 'url2/foo2.js', 'url3/foo2.js',..., 'methodInFoo2'],
        ..., allLoadedCallBack);

asynchronous, no order, with some reserve url, run allLoadedCallBack after all js loaded.'jquery' use to detect whether 'jquery.js' load success or false, 'angular'  is also.

    reserveLoad.async(
        ['url1/jquery.js', 'url2/jquery.js', 'url3/jquery.js',..., 'jquery'],
        ['url1/angular.js', 'url2/angular.js', 'url3/angular.js',..., 'angular'],
        ..., allLoadedCallBack);




