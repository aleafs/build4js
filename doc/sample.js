/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

var os = require('os');
var path = require('path');
var build = require('build');

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

  }, _force)).compile();
}

var _me = build.create(_defaults, HOME, _force);

/* {{{ task_make_test() */
var task_make_test = function () {
  _me.makedir('test/unit/etc');
  _me.makedir('test/unit/tmp');

  _me.makeconf('build/test', 'test/unit/etc/');
  _me.makeconf('build/tpl/rest.ini', 'test/unit/etc/rest.ini', {
    'statusfile' : path.normalize(__dirname + '/../test/unit/tmp/status'),
  });
  _me.makeconf('build/tpl/daemon.ini', 'test/unit/etc/daemon.ini');
};

/* }}} */

/* {{{ task_make_bin() */

var task_make_bin = function () {
  _me.makedir('bin');
  _me.makedir(_me.$('log.root'));
  _me.makeconf('node_modules/shark/resource/script/appctl.sh',   'bin/' + __APPNAME__, {
    'app.name'  : __APPNAME__,
    '200.file'  : _me.$('200.file', ''),
    'properties': _me.$('propfile', _props),
    'node.bin'  : _me.$('node.bin', process.execPath),
  });
  Builder.setmode('bin/' + __APPNAME__, 0755);

  _me.makeconf('build/script/logclean.sh', 'bin/logclean', {
    'log.expire' : _me.$('log.expire', 7)
  });
  Builder.setmode('bin/logclean', 0755);
};
/* }}} */

task_make_test();
task_make_bin();
process.exit(0);

