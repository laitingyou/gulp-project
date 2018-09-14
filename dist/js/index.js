"use strict";

var Init = function Init() {
  var navHash = {
    zhekou: 9891,
    miaosha: 3401,
    temai: 9921,
    maoyi: 9922,
    weiyi: 9923,
    neiyi: 9924,
    old: 9925,
    dayi: 9926,
    waitao: 9927,
    niuzai: 9928
  };
  var dataType = {};

  var request = function request(_ref) {
    var _ref$url = _ref.url,
        url = _ref$url === void 0 ? '' : _ref$url,
        _ref$method = _ref.method,
        method = _ref$method === void 0 ? 'post' : _ref$method,
        _ref$args = _ref.args,
        args = _ref$args === void 0 ? {} : _ref$args,
        success = _ref.success,
        callback = _ref.callback,
        fail = _ref.fail;
    var callbackName = ('jsonp_' + Math.random()).replace(".", "");
    var oHead = document.getElementsByTagName('head')[0];
    args[callback] = callbackName;
    var script = document.createElement('script');

    script.onerror = function (err) {
      fail && fail(err);
    };

    oHead.appendChild(script);

    window[callbackName] = function (json) {
      oHead.removeChild(script);
      window[callbackName] = null;
      success && success(json);
    };

    var query = '?';

    for (var i in args) {
      query += "".concat(i, "=").concat(args[i], "&");
    }

    query = query.slice(0, -1);
    script.src = url + query; // let xhr = new XMLHttpRequest();
    // // xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    // // xhr.setRequestHeader("","");
    // if(method == 'get'){
    //   xhr.open(method, url+query , true);
    //   xhr.send();
    // }else {
    //   xhr.open(method, url, true );
    //   xhr.send(query);
    // }
    // // xhr.responseType = 'text';
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 4 && xhr.status == 200) {
    //     success && success(xhr.responseText)
    //   }else {
    //     fail && fail(JSON.parse(xhr.responseText))
    //   }
    // };
  };

  var getGoods = function getGoods(act_id) {
    request({
      url: 'https://www.eelly.test/index.php',
      method: 'get',
      callback: 'callback',
      args: {
        app: 'activity',
        act: 'activityGoods',
        act_id: act_id
      },
      success: function success(res) {
        dataType[act_id] = res;
        var tpl = document.getElementById('live-tpl').innerHTML;
        var template = Handlebars.compile(tpl);
        var context = {
          list: [1, 2, 3, 4, 5, 6, 7, 8],
          name: "zhaoshuai",
          content: "learn Handlebars"
        };
        var html = template(context);
        document.getElementById('live').innerHTML = html;
      },
      fail: function fail(err) {
        console.log(err);
      }
    });
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
    var act_id = location.hash.replace('#', '');
    console.log(navHash[act_id]);
    dataType[act_id] || getGoods(navHash[act_id]);
  });
  return {
    start: function start() {
      getGoods(9921);
      getLive();
    }
  };
};

var app = new Init();
app.start();