'use strict';

/*!
  * reserveLoad.js, version 0.1.0, 2013/07/31
  * Load Javascript with reserve URL by asynchronous or synchronism
  * https://github.com/zensh/reserveLoad.js
  * (c) admin@zensh.com 2013
  * License: MIT
  */

(function (global, undefined) {

    var doc = global.document,
        head = doc.getElementsByTagName('head')[0] || doc.documentElemen,
        event = ['onerror', 'onload', 'onreadystatechange'];

    function each(list, iterator) {
        for (var i = 0, l = list.length; i < l; i++) {
            iterator.call(null, list[i], i, list);
        }
    }

    function eachAsync(list, iterator) {
        var keys = [];
        each(list, function (x, i) {
            keys.push(i);
        });
        keys.reverse();
        next();

        function next() {
            var key = keys.pop();
            iterator.call(null, keys.length === 0 ? null : next, list[key], key, list);
        }
    }

    function request(url, fn, callback) {
        var node = doc.createElement('script');

        each(event, function (x) {
            node[x] = onEvent;
        });
        if (url) {
            node.async = true;
            node.src = url;
        } else {
            return;
        }
        head.insertBefore(node, head.firstChild);

        function onEvent() {
            var success = fn ? global[fn] : true;
            if (/^(?:loaded|complete|undefined)$/.test(node.readyState + '')) {
                if (!success) {
                    head.removeChild(node);
                }
                // Dereference the node
                each(event, function (x) {
                    node[x] = null;
                });
                node = null;
                callback(!!success);
            }
        }
    }

    function startLoad(list, async) {
        var count = 0,
            total = list.length,
            callback = typeof (callback = list[total - 1]) === 'function' ? (list.length = total - 1, callback) : null;

        total = callback ? total - 1 : total;
        if (async) {
            each(list, load);
        } else {
            eachAsync(list, function (next, x) {
                load(x, next);
            });
        }

        function checkLoaded(next) {
            if (count === total) {
                return callback && callback();
            } else if (typeof next === 'function') {
                return next();
            }
        }

        function load(array, nextLoad) {
            if (typeof array === 'object' && array.length) {
                var len = array.length - 1,
                    fnName = array[len];
                eachAsync(array.slice(0, len), function (next, x) {
                    request(x, fnName, function (success) {
                        count += +success;
                        if (next) {
                            next();
                        } else {
                            checkLoaded(nextLoad);
                        }
                    });
                })
            }
        }
    }

    global.reserveLoad = function () {
        startLoad(Array.prototype.slice.call(arguments));
    };
    global.reserveLoad.async = function () {
        startLoad(Array.prototype.slice.call(arguments), true);
    }
})(window);
