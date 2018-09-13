"use strict";

var Init = function Init() {
  var dataType = {};

  var request = function request(_ref) {
    var url = _ref.url,
        _ref$method = _ref.method,
        method = _ref$method === void 0 ? 'post' : _ref$method,
        _ref$args = _ref.args,
        args = _ref$args === void 0 ? {} : _ref$args;
    var query = '';

    for (var i in args) {
      query += "?".concat(i, "=").concat(args[i], "&");
    }

    console.log(query.slice(-1));
    var xhr = new XMLHttpRequest();
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.open('post', '02.post.php');
    xhr.send('name=fox&age=18');

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
      }
    };
  };

  var getGoods = function getGoods(pamater) {
    var tpl = document.getElementById('live-tpl').innerHTML;
    var template = Handlebars.compile(tpl);
    var context = {
      list: [1, 2, 3, 4, 5, 6, 7, 8],
      name: "zhaoshuai",
      content: "learn Handlebars"
    };
    var html = template(context);
    document.getElementById('live').innerHTML = html;
  };

  var getLive = function getLive(pamater) {
    var tpl = document.getElementById('good-tpl').innerHTML;
    var template = Handlebars.compile(tpl);
    var context = {
      list: [1, 2, 3, 4, 5, 6, 7, 8],
      name: "zhaoshuai",
      content: "learn Handlebars"
    };
    var html = template(context);
    document.getElementById('goods-item').innerHTML = html;
    document.getElementById('goods-item1').innerHTML = html;
    document.getElementById('goods-item2').innerHTML = html;
    document.getElementById('goods-item3').innerHTML = html;
  };

  window.addEventListener('hashchange', function () {
    console.log(location.hash);
  });
  return {
    start: function start() {
      getGoods();
      getLive();
      request({
        args: {
          a: 1,
          b: 23
        }
      });
    }
  };
};

var app = new Init();
app.start();