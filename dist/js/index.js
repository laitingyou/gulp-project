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

  var getGoods = function getGoods(act_type) {
    request({
      url: 'https://www.eelly.test/index.php',
      method: 'get',
      callback: 'callback',
      args: {
        app: 'activity',
        act: 'activityGoods',
        act_id: navHash[act_type]
      },
      success: function success(res) {
        dataType[act_type] = res.goodsList;
        var tpl = document.getElementById('good-tpl').innerHTML;
        var template = Handlebars.compile(tpl);
        var context = {
          list: [1, 2, 3, 4, 5, 6, 7, 8],
          name: "zhaoshuai",
          content: "learn Handlebars"
        };
        var html = template(context);
        document.getElementById(act_type).getElementsByClassName('item-container')[0].innerHTML = html;
      },
      fail: function fail(err) {
        console.log(err);
      }
    });
  };

  var getLive = function getLive(pamater) {
    var tpl = document.getElementById('live-tpl').innerHTML;
    var template = Handlebars.compile(tpl);
    var context = {
      list: [1, 2, 3, 4, 5, 6, 7, 8],
      name: "zhaoshuai",
      content: "learn Handlebars"
    };
    var html = template(context);
    document.getElementById('living').getElementsByClassName('item-container')[0].innerHTML = html; // document.getElementById('goods-item1').innerHTML = html
    // document.getElementById('goods-item2').innerHTML = html
    // document.getElementById('goods-item3').innerHTML = html
  };

  window.addEventListener('hashchange', function () {
    var act_type = location.hash.replace('#', '');
    dataType[act_type] || getGoods(act_type);
  });
  var timer = null;
  window.addEventListener('scroll', function (e) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      var scrollTop = document.documentElement.scrollTop;
      var containers = document.getElementsByClassName('goods-container');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = containers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          if (scrollTop - item.offsetTop < 200) {
            var id = item.getAttribute('id');

            if (id === 'living') {
              getLive();
            } else {
              dataType[id] || getGoods(id);
            }

            break;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = containers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _item = _step2.value;

          if (scrollTop - _item.offsetTop > 100 && scrollTop - _item.offsetTop < 300) {
            var _id = _item.getAttribute('id');

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = document.getElementsByClassName('nav')[0].children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var child = _step3.value;
                child.className = '';
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }

            document.getElementById("nav-".concat(_id)).className = 'hover';
            break;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }, 50);
  });
  return {
    start: function start() {
      getGoods('temai');
      getLive();
    }
  };
};

var app = new Init();
app.start();