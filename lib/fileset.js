/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');
var path = require('path');

var mkdir = exports.mkdir = function (dir, mode) {
  if (path.existsSync(dir)) {
    return;
  }

  var p = path.dirname(dir);
  if (p && p != dir) {
    mkdir(p, mode);
  }
  fs.mkdirSync(dir, mode || 493/**< 0755*/);
};

/**
 * build工具，异常应该尽早地暴露
 */
exports.create = function (dir, filter, callback) {

  if ('function' !== (typeof arguments[2])) {
    callback = filter;
    var filter = function (s) {
      return ('.' !== s.charAt(0)) ? true : false;
    };
  } else if ('function' !== (typeof filter)) {
    var _ = new RegExp(filter);
    var filter = function (s) {
      return _.test(s);
    };
  }

  /**
   * @ realpath ?
   */
  var root = path.normalize(dir);
  if (!fs.statSync(root).isDirectory()) {
    callback(SubFile(root, ''));
    return;
  }

  var head = root.length;
  (function walk(dir) {
    fs.readdirSync(dir).forEach(function (file) {
      if (!filter(file)) {
        return;
      }

      var all = path.normalize(dir + '/' + file);
      if (fs.statSync(all).isDirectory()) {
        walk(all);
      } else {
        callback(SubFile(all, all.substring(head)));
      }
    });
  })(root);
};

var SubFile = function (fname, base) {

  var _me = {
    'base' : base,
    'full' : fname,
  };

  _me.toString = function () {
    return _me.full;
  };

  _me.setmode = function (mode, fn) {
    fs.chmodSync(fn || _me.full, mode);
  };

  return _me;
};

