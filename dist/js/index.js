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
  /**
   * jsonp 跨域请求
   * @param url 链接
   * @param args 参数
   * @param success 成功回调
   * @param callback 跨域回调名字
   * @param fail 失败回调
   */

  var jsonp = function jsonp(_ref) {
    var _ref$url = _ref.url,
        url = _ref$url === void 0 ? '' : _ref$url,
        _ref$args = _ref.args,
        args = _ref$args === void 0 ? {} : _ref$args,
        success = _ref.success,
        callback = _ref.callback,
        fail = _ref.fail;
    var callbackName = ('jsonp_' + Math.random()).replace(".", "");
    var oHead = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    args[callback] = callbackName; // 回调函数名

    script.onerror = function (err) {
      fail && fail(err);
    };

    oHead.appendChild(script);

    window['jsonp_043888737223328556' || callbackName] = function (json) {
      oHead.removeChild(script);
      window[callbackName] = null;
      success && success(json);
    };

    var query = '?';

    for (var i in args) {
      query += "".concat(i, "=").concat(args[i], "&");
    }

    query = query.slice(0, -1);
    script.src = url + query;
  };
  /**
   * 注册口令
   */


  var register = function register() {
    Handlebars.registerHelper('divstart', function (v1, options) {
      if (v1 % 4 === 0) {
        return options.fn(this);
      }

      return options.inverse(this);
    });
    Handlebars.registerHelper('divend', function (v1, options) {
      if (v1 === 3 || v1 === 7) {
        return options.fn(this);
      }

      return options.inverse(this);
    });
  };
  /**
   * 场次倒计时
   */


  var timerTemplate = function timerTemplate(act_type, ss) {
    var tpl = document.getElementById('timer').innerHTML;
    var template = Handlebars.compile(tpl);
    timeHandler(ss, function (time) {
      var html = template(time);
      document.getElementById(act_type).getElementsByClassName('timer-container')[0].innerHTML = html;
    });
  };
  /**
   * 获取商品
   * @param act_type
   */


  var getGoods = function getGoods(act_type) {
    jsonp({
      url: 'https://www.eelly.test/index.php',
      callback: 'callback',
      args: {
        app: 'activity',
        act: 'activityGoods',
        act_id: navHash[act_type]
      },
      success: function success(res) {
        var goodsList = res.goodsList,
            overTime = res.overTime,
            startTime = res.startTime;
        dataType[act_type] = goodsList;
        var tpl = document.getElementById('good-tpl').innerHTML;
        var template = Handlebars.compile(tpl);
        var context = {
          list: goodsList.slice(0, 8),
          overTime: overTime,
          startTime: startTime
        };
        var html = template(context);
        document.getElementById(act_type).getElementsByClassName('item-container')[0].innerHTML = html;
        var endTieme = overTime - startTime; //如果小于一天，就显示倒计时

        if (endTieme < 86400) {
          timerTemplate(act_type, endTieme);
        }
      },
      fail: function fail(err) {
        console.log(err);
      }
    });
  };
  /**
   * 获取直播列表
   * @param pamater
   */


  var getLive = function getLive(pamater) {
    jsonp({
      url: 'https://www.eelly.com/index.php',
      callback: 'callback',
      args: {
        app: 'live',
        act: 'search'
      },
      success: function success(res) {
        var content = res.content;
        var tpl = document.getElementById('live-tpl').innerHTML;
        var template = Handlebars.compile(tpl);
        var context = {
          list: content.items
        };
        var html = template(context);
        document.getElementById('living').getElementsByClassName('item-container')[0].innerHTML = html;
      },
      fail: function fail(err) {
        console.log(err);
      }
    });
  };
  /**
   * 格式化时间
   * @param time
   * @returns {string}
   */


  var timeFormat = function timeFormat(time) {
    var s = time;
    var dd = Math.floor(s / 86400);
    var hh = ('0' + (Math.floor(s / 3600) - dd * 24)).slice(-2);
    var mm = ('0' + (Math.floor(s / 60) - dd * 24 * 60 - hh * 60)).slice(-2);
    var ss = ('0' + s % 60).slice(-2);
    if (dd === '00' && hh === '00' && mm === '00' && ss === '00') return;

    if (dd.length < 2) {
      dd = ~~('0' + dd);
    }

    return {
      dd: dd,
      hh: hh,
      mm: mm,
      ss: ss
    };
  };
  /**
   * 倒计时
   * @param time
   * @param callback
   */


  var timeHandler = function timeHandler(time, callback) {
    callback(timeFormat(time));
    setTimeout(function () {
      timeHandler(--time, callback);
    }, 1000);
  };
  /**
   * 页面进入执行
   */


  var mouted = function mouted() {
    // 注册模板口令
    register(); // 顶部倒计时

    timeHandler(10000, function (time) {
      var dd = time.dd,
          hh = time.hh,
          mm = time.mm,
          ss = time.ss;
      document.getElementById('top-timer').innerHTML = dd > 0 ? "".concat(dd, "\u5929").concat(hh, "\u5C0F\u65F6").concat(mm, "\u5206") : "".concat(hh, "\u5C0F\u65F6").concat(mm, "\u5206").concat(ss, "\u79D2");
    }); // 监听hash值变化

    window.addEventListener('hashchange', function () {
      var act_type = location.hash.replace('#', '');
      dataType[act_type] || getGoods(act_type);
    }); // 数据滚动加载

    var timer = null;
    var cross = 1;
    window.addEventListener('scroll', function (e) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var scrollTop = document.documentElement.scrollTop;
        var containers = document.getElementsByClassName('goods-container'); // 处理数据

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
          } // 处理样式

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

            if (scrollTop - _item.offsetTop < 1000) {
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
  };
  /**
   * 对外开放函数
   */


  return {
    start: function start() {
      window.onload = function () {
        document.getElementById('input').focus(); // 让每次刷新都滚动最顶部

        mouted();
        getLive();
      };
    }
  };
}; // 实例


var app = new Init();
app.start(); // 启动