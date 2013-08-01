'use strict';

/*!
 * reserveLoad.js, version 0.2.0, 2013/08/01
 * Asyncronous JavaScript/CSS loader and dependency manager, and load JavaScript with reserve URL.
 * https://github.com/zensh/reserveLoad.js
 * (c) admin@zensh.com 2013
 * License: MIT
 */

(function (global, undefined) {

    var doc = global.document,
        location = doc.location,
        head = doc.getElementsByTagName('head')[0] || doc.documentElemen,
        baseElement = head.getElementsByTagName('base')[0],
        baseURL = baseElement ? baseElement.href : location.protocol + '//' + location.host,
        events = ['onerror', 'onload', 'onreadystatechange'],
        slice = Array.prototype.slice,
        validBase = /^https?:\/\//,
        validCSS = /\.css(?:\?|$)/i,
        validState = /^(?:loaded|complete|undefined)$/;

    var reserveLoad = global.reserveLoad = function () {
        startLoad(slice.call(arguments));
    };
    reserveLoad.async = function () {
        startLoad(slice.call(arguments), true);
    }
    reserveLoad.version = '0.2.0';

    function isArray(obj) {
        return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
    }

    function each(list, iterator, context) {
        for (var i = 0, l = list.length; i < l; i++) {
            iterator.call(context, list[i], i, list);
        }
    }

    function eachAsync(list, iterator, context) {
        var keys = [];
        each(list, function (x, i) {
            keys.push(i);
        });
        keys.reverse();
        next();

        function next() {
            var key = keys.pop();
            iterator.call(context, keys.length === 0 ? null : next, list[key], key, list);
        }
    }

    function parse(context, expStr) {
        return _parse(context, isArray(expStr) ? expStr : expStr.split('.'));

        function _parse(context, array) {
            var key = array[0],
                value = context[key],
                type = typeof value;
            return array.length > 1 && type && (type === 'object' || type === 'function') ? _parse(value, array.slice(1)) : value;
        }
    }

    function request(url, fn, callback) {
        var isCSS = validCSS.test(url),
            node = doc.createElement(isCSS ? 'link' : 'script'),
            success = isCSS || !fn;

        each(events, function (x) {
            node[x] = onEvent;
        });
        if (isCSS) {
            node.rel = 'stylesheet'
            node.href = url
        } else if (url) {
            node.async = true;
            node.src = url;
        } else {
            return;
        }
        head.insertBefore(node, head.firstChild);

        function onEvent() {
            if (validState.test(node.readyState + '')) {
                success = success || !!parse(global, fn);
                console.log(url, success, node.readyState);
                if (!success) {
                    head.removeChild(node);
                } else {
                    each(events, function (x) {
                        node[x] = null;
                    });
                    node = null;
                }
                callback(success);
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

        function checkLoaded(next, url) {
            if (url || count === total) {
                return callback && callback(url);
            } else if (typeof next === 'function') {
                return next();
            }
        }

        function load(array, nextLoad) {
            if (typeof array === 'object' && array.length) {
                var len = array.length - 1,
                    fnName = array[len];
                array.length = len;
                eachAsync(array, function (next, x) {
                    x = validBase.test(x) ? x : (x ? baseURL + x : '');
                    request(x, fnName, function (success) {
                        count += +success;
                        if (!success && next) {
                            next();
                        } else {
                            checkLoaded(nextLoad, success ? null : x);
                        }
                    });
                })
            }
        }
    }
})(window);