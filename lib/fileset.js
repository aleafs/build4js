/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');
var path = require('path');

/**
 * build工具，异常应该尽早地暴露
 */
exports.create = function (dir, /**filter, */callback) {

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
      if ('.' === file || '..' === file) {
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

  _me.setmode = function (mode) {
    fs.chmodSync(_me.full, mode);
  };

  return _me;
};

