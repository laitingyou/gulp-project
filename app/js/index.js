const Init = function () {
  let navHash = {
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
  }
  let dataType = {}
  let nowTime = 0
  /**
   * jsonp 跨域请求
   * @param url 链接
   * @param args 参数
   * @param success 成功回调
   * @param callback 跨域回调名字
   * @param fail 失败回调
   */
  const jsonp = function ({
                            url = '',
                            args = {},
                            success,
                            callback,
                            fail
                          }) {
    let callbackName = ('jsonp_' + Math.random()).replace(".", "");
    let oHead = document.getElementsByTagName('head')[ 0 ];
    let script = document.createElement('script');
    args[ callback ] = callbackName; // 回调函数名
    script.onerror = function (err) {
      fail && fail(err)
    }
    oHead.appendChild(script);
    window[ callbackName ] = function (json) {
      oHead.removeChild(script);
      window[ callbackName ] = null;
      success && success(json);
    };
    let query = '?'
    for (let i in args) {
      query += `${i}=${args[ i ]}&`
    }
    query = query.slice(0, -1)
    script.src = url + query;
  }
  
  const getTime = function (callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/',true);
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4) {
        nowTime = xhr.getResponseHeader('date')
        callback(xhr.getResponseHeader('date'))
      }
    };
    xhr.send();
  }
  
  /**
   * 场次倒计时
   */
  let timerTemplate = function (act_type, ss) {
    timeHandler(ss, function (time) {
      let html = template('timer',time);
      document.getElementById(act_type).getElementsByClassName('timer-container')[ 0 ].innerHTML = html
    })
  }
  /**
   * 获取商品
   * @param act_type
   */
  const getGoods = function (act_type) {
    jsonp({
      url: 'https://www.eelly.com/index.php',
      callback: 'callback',
      args: {
        app: 'activity',
        act: 'activityGoods',
        act_id: navHash[ act_type ],
      },
      success (res) {
        let { goodsList, overTime, startTime } = res
        dataType[ act_type ] = goodsList
        let context = { list: goodsList, overTime, startTime, act_type };
        let html = template('good-tpl',context);
        document.getElementById(act_type).getElementsByClassName('item-container')[ 0 ].innerHTML = html
        let endTieme = overTime - startTime
        //如果小于一天，就显示倒计时
        if (endTieme < 86400) {
          timerTemplate(act_type, endTieme)
        }
      },
      fail (err) {
        console.log(err)
      }
    })
  }
  /**
   * 获取直播列表
   * @param pamater
   */
  const getLive = function (pamater) {
    jsonp({
      url: 'https://www.eelly.com/index.php',
      callback: 'callback',
      args: {
        app: 'live',
        act: 'search'
      },
      success (res) {
        let { content } = res
        let context = { list: content.items };
        let html = template('live-tpl',context);
        document.getElementById('living').getElementsByClassName('item-container')[ 0 ].innerHTML = html
      },
      fail (err) {
        console.log(err)
      }
    })

  }

  /**
   * 格式化时间
   * @param time
   * @returns {string}
   */
  const timeFormat = function (time) {
    let s = time;
    let dd = Math.floor(s / 86400)
    let hh = ('0' + (Math.floor(s / 3600) - dd * 24)).slice(-2)
    let mm = ('0' + (Math.floor(s / 60) - dd * 24 * 60 - hh * 60)).slice(-2)
    let ss = ('0' + (s % 60)).slice(-2)
    if (dd === '00' && hh === '00' && mm === '00' && ss === '00') return;
    if (dd.length < 2) {
      dd = ~~('0' + dd)
    }
    return { dd, hh, mm, ss }
  }
  /**
   * 倒计时
   * @param time
   * @param callback
   */
  const timeHandler = function (time, callback) {
    callback(timeFormat(time))
    setTimeout(function () {
      timeHandler(--time, callback)
    }, 1000)
  }
  /**
   * 页面进入执行
   */
  const mouted = function () {
    let end = ~~(new Date('2018/9/26 23:59:29').getTime()/1000),
      now = ~~(new Date(nowTime).getTime()/1000),
      m = 0
    // 顶部倒计时
    timeHandler(end - now , function (time) {
      let { dd, hh, mm, ss } = time
      if(dd>0 && m == mm){
        return 0
      }
      m = mm
      document.getElementById('top-timer').innerHTML = dd > 0 ? `${dd}天${hh}小时${mm}分` : `${hh}小时${mm}分${ss}秒`
    })

    // 监听hash值变化
    window.addEventListener('hashchange', function () {
      let act_type = location.hash.replace('#', '')
      dataType[ act_type ] || getGoods(act_type)
    })

    // 数据滚动加载
    let timer = null
    let cross = 1
    window.addEventListener('scroll', function (e) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        let containers = document.getElementsByClassName('goods-container')
        // 处理数据
        for (let i=0;i<containers.length;i++) {
           let item = containers[i]
          if (scrollTop - item.offsetTop < 200) {
            let id = item.getAttribute('id')
            if (id === 'living') {
              getLive()
            } else {
              dataType[ id ] || getGoods(id)
            }
            break
          }
        }
        // 处理样式
        for (let i=0;i<containers.length;i++) {
          let item = containers[i]
          if (scrollTop - item.offsetTop < 1000) {
            let id = item.getAttribute('id')
            let childs =  document.getElementsByClassName('nav')[ 0 ].children
            for (let j=0;j<childs.length;j++) {
              let child = childs[j]
              child.className = ''
            }
            document.getElementById(`nav-${id}`).className = 'hover'
            break
          }
        }
      }, 100)
    })
  }
  /**
   * 对外开放函数
   */
  return {
    start: function () {
      window.onload=function () {
        document.getElementById('input').focus() // 让每次刷新都滚动最顶部
        getTime(function () {
          mouted()
        })
        getLive()
      }
    }
  }
}

// 实例
let app = new Init()
app.start() // 启动
