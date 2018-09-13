"use strict";

var Init = function Init() {
  var dataType = {};

  var getGoods = function getGoods() {
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
    }
  };
};

var app = new Init();
app.start();