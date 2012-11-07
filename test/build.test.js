/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

var should  = require('should');
var fs      = require('fs');
var Build   = require(__dirname + '/../');

describe('build library', function() {

  /* {{{ should_without_file_works_fine() */
  it('should_without_file_works_fine', function () {
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

  /* {{{ should_build_compile_works_fine() */
  it('should_build_compile_works_fine', function (done) {

    var _me = Build.create(__dirname + '/tpl/test1.properties', __dirname);
    _me.properties().should.eql({
      'test.c1' : '123dsf=4 5有效',
      'test.c2' : '"replace last data"',
      'test.c3' : '1345281197672',
      'test.c4' : '##i.will.not.be.found##',
      'test.c5' : '##contain.next##',
      'test.c6' : '##time.now##'
    });

    var _tm = Date.now();
    var _me = Build.create('i_am_not_exists', __dirname, {
      'time.now' : 0
    });
    _me.properties().should.eql({
      'time.now' : 0
    });

    var _fn = _me.compile(__dirname + '/tpl/test1.properties', 'a.log', {
      'contain.next' : '##time.now##',
      'time.now' : _tm
    });

    fs.readFile(_fn, 'utf8', function (e, d) {
      should.ok(!e);

      Build.create(_fn).properties().should.eql({
        'test.c1' : '123dsf=4 5有效',
        'test.c2' : '"replace last data"',
        'test.c3' : '1345281197672',
        'test.c4' : '##i.will.not.be.found##',
        'test.c5' : '##time.now##',
        'test.c6' : _tm + ''
      });

      Build.syntax(_fn).should.eql(['i.will.not.be.found', 'time.now']);

      done();
    });
  });
  /* }}} */

  /**
   * this is a bug case
   */
  it('should_syntax_works_fine_when_none_pattern', function (done) {
    fs.writeFile(__dirname + '/a.log', 'aa', function (e) {
      should.ok(!e);
      Build.syntax(__dirname + '/a.log').should.eql([]);
      done();
    });
  });

});

