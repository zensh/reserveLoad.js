'use strict';

/*!
 * reserveLoad.js, version 0.4.0, 2013/10/27
 * Dynamic JavaScript/CSS loader, and load JavaScript with reserve URL.
 * https://github.com/zensh/reserveLoad.js
 * (c) admin@zensh.com 2013
 * License: MIT
 */

(function (global) {
  var doc = global.document,
    _define = global.define,
    location = doc.location,
    head = doc.getElementsByTagName('head')[0] || doc.documentElement,
    baseElement = head.getElementsByTagName('base')[0],
    slice = [].slice,
    validCSS = /\.css(?:\?|$)/i,
    validState = /^(?:loaded|complete|undefined)$/,
    currentlyAddingScript = null,
    scripts = {};

  var reserveLoad = global.reserveLoad = function () {
    startLoad(slice.call(arguments));
  };
  reserveLoad.version = 'v0.4.0';
  global.define = function (name, deps, callback) {
    var fn = isFunction(callback) ? callback : isFunction(deps) ? deps : isFunction(name) ? name : noop;
    if (currentlyAddingScript) {
      scripts[currentlyAddingScript] = fn();
      currentlyAddingScript = null;
    } else if (isFunction(_define)) {
      _define(name, deps, callback);
    }
  };

  function noop() {}

  function isArray(obj) {
    return Array.isArray ? Array.isArray(obj) : Object.prototype.toString.call(obj) === '[object Array]';
  }
  function isFunction(fn) {
    return typeof fn === 'function';
  }
  function each(array, iterator, context) {
    for (var i = 0, l = array.length; i < l; i++) {
      iterator.call(context, array[i], i, array);
    }
  }
  function eachThen(array, iterator, context) {
    var i = -1,
      end = array.length - 1;
    function next() {
      i += 1;
      iterator.call(context, i < end ? next : null, array[i], i, array);
    }
    return next();
  }
  function getScript(context, exports, url) {
    var value = null;
    if (url) {
      if (scripts[url]) {
        value = scripts[url];
      } else if (isFunction(exports)) {
        value = exports();
        scripts[url] = value;
      } else if (exports && typeof exports === 'string') {
        value = context || global;
        each(exports.split('.'), function (part) {
          if (value) {
            value = value[part];
          }
        });
        scripts[url] = value;
      }
    }
    return value;
  }
  function request(url, exports, callback) {
    var isCSS = validCSS.test(url),
      node = doc.createElement(isCSS ? 'link' : 'script'),
      success = isCSS || !exports;

    if (!url || (!isCSS && getScript(global, exports, url))) {
      return;
    }
    node.onload = node.onerror = node.onreadystatechange = function () {
      if (validState.test(node.readyState + '')) {
        if (!isCSS) {
          head.removeChild(node);
        }
        node = node.onload = node.onerror = node.onreadystatechange = null;
        callback(success || !! getScript(global, exports, url));
      }
    };
    if (isCSS) {
      node.rel = 'stylesheet';
      node.href = url;
    } else {
      node.async = 1;
      node.src = url;
    }
    currentlyAddingScript = url;
    head[baseElement ? 'insertBefore' : 'appendChild'](node, baseElement);
  }

  function startLoad(list) {
    var count = 0,
      total = list.length,
      scriptList = [],
      callback = list[total - 1];

    function checkLoaded(next, url) {
      if (url || count === total) {
        each(scriptList, function (key, index) {
          scriptList[index] = scripts[key] || key;
        });
        scriptList.unshift(url);
        return callback.apply(null, scriptList);
      } else if (isFunction(next)) {
        return next();
      }
    }
    function load(array, nextLoad) {
      function get(url, fnName, next) {
        request(url, fnName, function (success) {
          count += +success;
          if (!success && next) {
            next();
          } else {
            scriptList.push(url);
            checkLoaded(nextLoad, success ? null : url);
          }
        });
      }
      if (isArray(array)) {
        var checkFn;
        if (array.length > 1) {
          checkFn = array.pop();
        }
        eachThen(array, function (next, x) {
          get(x, checkFn, next);
        });
      } else if (array && typeof array === 'string') {
        get(array, null);
      } else {
        count += 1;
        checkLoaded(nextLoad, null);
      }
    }
    if (isFunction(callback)) {
      total -= 1;
      list.pop();
    } else {
      callback = noop;
    }
    eachThen(list, function (next, x) {
      load(x, next);
    });
  }
})(window);