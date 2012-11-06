/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

var should  = require('should');
var fs      = require('fs');
var fileset = require(__dirname + '/../').fileset;

describe('fileset test', function () {

  /* {{{ should_fileset_walk_works_fine() */
  it('should_fileset_walk_works_fine', function() {

    var _files = [];
    fileset(__dirname, function(file) {
      _files.push(file.full);
      if (file.full.indexOf('.git') > -1) {
        // XXX: 默认去掉隐藏文件
        (true).should.eql(false);
      }
    });
    _files.should.include(__filename);

    fileset(__filename, function(fname) {
      fname.toString().should.eql(__filename);
    });

    try {
      var _files  = [];
      fileset(__dirname + '/i_am_not_exist', function(fname) {
        _files.push(fname);
      });
      (true).should.eql(false);
    } catch (e) {
      e.message.should.include('ENOENT, no such file or directory');
    }
    _files.should.eql([]);
  });
  /* }}} */

  /* {{{ should_fileset_setmode_works_fine() */
  it('should_fileset_setmode_works_fine', function(done) {
    fileset(__filename, function (f) {
      f.setmode(0777);
      var _me = fs.statSync(__filename);
      should.ok(_me.mode & 040);
      should.ok(_me.mode & 020);
      should.ok(_me.mode & 010);

      f.setmode(0644);
      var _me = fs.statSync(__filename);
      should.ok(_me.mode & 0400);
      should.ok(_me.mode & 0200);
      should.ok(!(_me.mode & 0100));

      done();
    });
  });
  /* }}} */

  /* {{{ should_fileset_filter_works_fine() */
  it('should_fileset_filter_works_fine', function () {

    fileset(__dirname, function (s) {return false;}, function (fn) {
      (true).should.eql(false);
    });

    var _files = [];
    fileset(__dirname + '/../', '.md$', function (fn) {
      _files.push(fn.base);
    });
    _files.should.eql(['README.md']);

    var _files = [];
    fileset(__dirname + '/../', /\.md$/, function (fn) {
      _files.push(fn.base);
    });
    _files.should.eql(['README.md']);
  });
  /* }}} */

  /* {{{ should_mkdir_works_fine() */
  it('should_mkdir_works_fine', function () {
    var dir = __dirname + '/tmp/a/b/' + process.pid;
    try {
      require('child_process').exec('rm -rf "' + dir + '"');
    } catch (e) {}

    require(__dirname + '/../').mkdir(dir);
    fs.statSync(dir).isDirectory().should.eql(true);
  });
  /* }}} */

});
