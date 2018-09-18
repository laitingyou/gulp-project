'use strict';

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
  var nowTime = 0;
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
        url = _ref$url === undefined ? '' : _ref$url,
        _ref$args = _ref.args,
        args = _ref$args === undefined ? {} : _ref$args,
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
    window[callbackName] = function (json) {
      oHead.removeChild(script);
      window[callbackName] = null;
      success && success(json);
    };
    var query = '?';
    for (var i in args) {
      query += i + '=' + args[i] + '&';
    }
    query = query.slice(0, -1);
    script.src = url + query;
  };

  var getTime = function getTime(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/', true);
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4) {
        nowTime = xhr.getResponseHeader('date');
        callback(xhr.getResponseHeader('date'));
      }
    };
    xhr.send();
  };

  /**
   * 场次倒计时
   */
  var timerTemplate = function timerTemplate(act_type, ss) {
    timeHandler(ss, function (time) {
      var html = template('timer', time);
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
        var context = { list: goodsList, overTime: overTime, startTime: startTime };
        var html = template('good-tpl', context);
        document.getElementById(act_type).getElementsByClassName('item-container')[0].innerHTML = html;
        var endTieme = overTime - startTime;
        //如果小于一天，就显示倒计时
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

        var context = { list: content.items };
        var html = template('live-tpl', context);
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
    return { dd: dd, hh: hh, mm: mm, ss: ss };
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
    var end = ~~(new Date('2018/9/26 23:59:29').getTime() / 1000),
        now = ~~(new Date(nowTime).getTime() / 1000),
        m = 0;
    // 顶部倒计时
    timeHandler(end - now, function (time) {
      var dd = time.dd,
          hh = time.hh,
          mm = time.mm,
          ss = time.ss;

      if (dd > 0 && m == mm) {
        return 0;
      }
      m = mm;
      document.getElementById('top-timer').innerHTML = dd > 0 ? dd + '\u5929' + hh + '\u5C0F\u65F6' + mm + '\u5206' : hh + '\u5C0F\u65F6' + mm + '\u5206' + ss + '\u79D2';
    });

    // 监听hash值变化
    window.addEventListener('hashchange', function () {
      var act_type = location.hash.replace('#', '');
      dataType[act_type] || getGoods(act_type);
    });

    // 数据滚动加载
    var timer = null;
    var cross = 1;
    window.addEventListener('scroll', function (e) {
      clearTimeout(timer);
      timer = setTimeout(function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var containers = document.getElementsByClassName('goods-container');
        // 处理数据
        for (var i = 0; i < containers.length; i++) {
          var item = containers[i];
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
        // 处理样式
        for (var _i = 0; _i < containers.length; _i++) {
          var _item = containers[_i];
          if (scrollTop - _item.offsetTop < 1000) {
            var _id = _item.getAttribute('id');
            var childs = document.getElementsByClassName('nav')[0].children;
            for (var j = 0; j < childs.length; j++) {
              var child = childs[j];
              child.className = '';
            }
            document.getElementById('nav-' + _id).className = 'hover';
            break;
          }
        }
      }, 100);
    });
  };
  /**
   * 对外开放函数
   */
  return {
    start: function start() {
      window.onload = function () {
        document.getElementById('input').focus(); // 让每次刷新都滚动最顶部
        getTime(function () {
          mouted();
        });
        // getLive()
        AOS.init();
      };
    }
  };
};

// 实例
var app = new Init();
app.start(); // 启动