[![Build Status](https://secure.travis-ci.org/aleafs/waitus.png?branch=master)](http://travis-ci.org/aleafs/waitus)

## About

假设一个场景，你需要从远程的网络服务（例如zookeeper）中备份一棵树到本地，这个服务能提供的特性有：

* client端只有异步API；
* 每次只能访问每个节点的下一层子节点，孙子是找不到的。

你的代码该怎么写？

## Install

```bash
$ npm install waitus
```

## Usage

```javascript

var waitus = require('waitus');
var _me	= waitus.create(function () {
  console.log('赤壁，开战！');
});

_me.wait('万事', function () {
  var evt = waitus.create(function () {
    _me.emit('万事');
  });
  evt.wait('最后一件事', function () {
    evt.emit('最后一件事');
  });
  evt.wait('其他9999件事', function () {
    evt.emit('其他9999件事');
  });
});

_me.wait('东风', function () {
  setTimeout(function () {
    _me.emit('东风');
  }, 1000);
});

```

## License

(The MIT License)

Copyright (c) 2012 aleafs and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
