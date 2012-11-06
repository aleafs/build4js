/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

"use strict";

var fs = require('fs');
var path = require('path');

/* {{{ private function Properties() */

var Properties = function (file) {
  var data  = {};
  try {
    fs.readFileSync(file, 'utf8').trim().split('\n').forEach(function(line) {
      if (line.match(/^(#|!)/)) {
        return;
      }
      var match = line.match(/^\s*(.+?)\s*=\s*(.*)\s*$/);
      if (!match) {
        return;
      }
      data[match[1].trim()] = match[2].trim();
    });
  } catch (e) {
  }

  return data;
};
/* }}} */

/* {{{ private function _extend() */
var _extend = function (a, b) {
  for (var i in b) {
    a[i] = b[i];
  }
  return a;
};
/* }}} */

exports.create = function (file, root, force) {

  /**
   * @ 根路径
   */
  var _DIRROOT = path.normalize(root || process.env.PWD || '');

  var _fixpath = function (d) {
    if ('/' !== d.charAt(0)) {
      d = path.normalize(_DIRROOT + '/' + d);
    }

    return d;
  };

  var _defaults = _extend('string' === typeof(file) ? Properties(_fixpath(file)) : {}, force);

  var _me = {};

  _me.properties = function () {
    return _extend({}, _defaults);
  };

  _me.get = function (key, _default) {
    return (undefined === _defaults[key]) ? _default : _defaults[key];
  };

  _me.compile = function (from, to, args) {
  };

  return _me;
};

