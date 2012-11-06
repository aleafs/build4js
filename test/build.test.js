/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

var should  = require('should');
var fs      = require('fs');
var Build   = require(__dirname + '/../');

describe('build library', function() {

  /* {{{ should_build_create_without_file_works_fine() */
  it('should_build_create_without_file_works_fine', function () {
    var _me = Build.create(null, null, {'foo' : 231, 'bar' : 'xxyz', 'zero' : 0});
    _me.get('foo').should.eql(231);
    _me.get('bar').should.eql('xxyz');
    _me.get('abc', 'zero').should.eql('zero');
    _me.get('zero').should.eql(0);

    var a = _me.properties();
    a.should.eql({
      'foo' : 231,
      'bar' : 'xxyz',
      'zero': 0,
    });

    // XXX: test for clone
    a.bar = 'abc';
    a.should.eql({
      'foo' : 231,
      'bar' : 'abc',
      'zero': 0,
    });
    _me.properties().should.eql({
      'foo' : 231,
      'bar' : 'xxyz',
      'zero': 0,
    });
  });
  /* }}} */

  /* {{{ should_build_init_works_fine() */
  it('should_build_init_works_fine', function() {

    var _me = Build.create('i_am_not_exists');
    _me.properties().should.eql({});

    var _me = Build.create(__dirname + '/tpl/test1.properties', __dirname);
    _me.properties().should.eql({
      'test.c1' : '123dsf=4 5有效',
      'test.c2' : '"replace last data"',
      'test.c3' : '1345281197672',
      'test.c4' : '##i.will.not.be.found##',
      'test.c5' : '1345281197672'
    });

    return;
    var the = (new Date()).getTime();

    _me.makedir(__dirname + '/etc/build').makedir('etc/build');
    _me.makeconf(__dirname + '/../../build/test/test.properties', 'etc/build/test1.properties', {
      'test.c3.value'   : the,
      'test.c5' : the,
    });

    var _me = Build.init('etc/build/test1.properties', __dirname, {
      'test.c2' : 'force value'
    });
    _me.property().should.eql({
      'test.c1' : '123dsf=4 5有效',
      'test.c2' : 'force value',
      'test.c3' : the + '',
      'test.c4' : '##i.will.not.be.found##',
      'test.c5' : the + '',
    });
    _me.makeconf(__dirname + '/../../build/test/test.properties', 'etc/build/test2.properties', {
      'test.c3.value'       : _me.$('test.c1'),
      'i.will.not.be.found' : 'i.am.found',
    });

    var _me = Build.init('etc/build/test2.properties', __dirname);
    _me.property().should.eql({
      'test.c1' : '123dsf=4 5有效',
      'test.c2' : '"replace last data"',
      'test.c3' : '123dsf=4 5有效',
      'test.c4' : 'i.am.found',
      'test.c5' : the + '',
    });
    _me.$('i am not defined', 'hello W').should.eql('hello W');
  });
  /* }}} */

  /* {{{ should_makeconf_with_directory_works_fine() */
  xit('should_makeconf_with_directory_works_fine', function () {
    var _me = Build.init('etc/build/test1.properties', __dirname, {
      'test.c2' : 'force value'
    });
    _me.makeconf(__dirname + '/../../build/test/', __dirname + '/tmp/');
  });
  /* }}} */

  /* {{{ should_makedir_works_fine() */
  xit('should_makedir_works_fine', function () {
    var dir = __dirname + '/tmp/a/b/' + process.pid;
    try {
      require('child_process').exec('rm -rf "' + dir + '"');
    } catch (e) {}

    var _me = Build.init('etc/build/test1.properties', __dirname, {
      'test.c2' : 'force value'
    });
    _me.makedir(dir);
    fs.statSync(dir).isDirectory().should.eql(true);
  });
  /* }}} */

});
