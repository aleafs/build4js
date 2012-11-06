/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

var os = require('os');
var path = require('path');
var build = require('build4js');
var HOME = process.env.PWD;

/**
 * @ 命令行参数(-D.)具有最高优先权
 * @ 其次为本地 _private.properties 文件中的变量（私人密码等，不希望提仓库）
 * @ 最后是本地定义的变量
 */
/* {{{ _force properties */
var _force = build.create(HOME + '/_private.properties').properties();
process.argv.slice(2).forEach(function (arg) {
  if (!(/^\-D/.test(arg))) {
    return;
  }

  var pattern = arg.slice(2).split('=');
  switch (pattern.length) {
    case 0:
      break;

    case 1:
      _force[pattern[0]] = true;
      break;

    default:
      _force[pattern[0]] = pattern[1];
      break;
  }
});
/* }}} */

/* {{{ private function _extend() */
var _extend = function (a, b) {
  for (var i in b) {
    a[i] = b[i];
  }
  return a;
};
/* }}} */

var _defaults = path.normalize(HOME + '/default-' + os.hostname() + '-' + os.arch() + '.properties');
if (!path.existsSync(_defaults)) {
  build.create(null, HOME, _extend({

    /**
     * @ 自定义变量
     */
    'dir.root'  : HOME,
    'run.user'  : process.env.USER,

  }, _force)).compile('build/tpl/default.properties', _defaults);
}

/**
 * Add your script here:
 */
var _me = build.create(_defaults, HOME, _force);
build.fileset(HOME + '/build/tpl', /\.(ini)$/, function (fn) {
  _me.compile(fn.full, 'etc/' + fn.base);
});

process.exit(0);

