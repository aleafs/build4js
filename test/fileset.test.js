/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

var should  = require('should');
var fs      = require('fs');
var fileset = require(__dirname + '/../').fileset;

describe('fileset test', function () {

  /* {{{ should_build_fileset_works_fine() */
  it('should_build_fileset_works_fine', function() {

    var _files = [];
    fileset(__dirname + '/../', function(file) {
      _files.push(file.full);
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

  /* {{{ should_build_setmode_works_fine() */
  it('should_build_setmode_works_fine', function(done) {
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

});
