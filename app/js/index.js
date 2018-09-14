const Init = function() {
  let navHash={
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
  let dataType={}


  const request = function ({
    url= '',
    method='post',
    args={},
    success,
     callback ,
    fail
                            }) {
    var callbackName = ('jsonp_' + Math.random()).replace(".", "");
    var oHead = document.getElementsByTagName('head')[0];
    args[callback] = callbackName;
    var script = document.createElement('script');
    script.onerror=function (err) {
      fail && fail(err)
    }
    oHead.appendChild(script);
    window[callbackName] = function (json) {
      oHead.removeChild(script);
      window[callbackName] = null;
      success && success(json);
    };
    let query = '?'
    for (let i in args){
      query += `${i}=${args[i]}&`
    }
    query = query.slice(0,-1)
    script.src = url + query;
    // let xhr = new XMLHttpRequest();
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
  }
  const getGoods=function (act_type) {
    request({
      url:'https://www.eelly.test/index.php',
      method: 'get',
      callback: 'callback',
      args:{
        app:'activity',
        act: 'activityGoods',
        act_id: navHash[act_type],
      },
      success(res){
        dataType[act_type] = res.goodsList
        let tpl = document.getElementById('good-tpl').innerHTML
        let template = Handlebars.compile(tpl)
        var context = {list:[1,2,3,4,5,6,7,8], name: "zhaoshuai", content: "learn Handlebars"};
        var html = template(context);
        document.getElementById(act_type).getElementsByClassName('item-container')[0].innerHTML = html
      },
      fail(err){
        console.log(err)
      }
    })
  }
  const  getLive=function (pamater) {
    let tpl = document.getElementById('live-tpl').innerHTML
    let template = Handlebars.compile(tpl)
    var context = {list:[1,2,3,4,5,6,7,8], name: "zhaoshuai", content: "learn Handlebars"};
    var html = template(context);
    document.getElementById('living').getElementsByClassName('item-container')[0].innerHTML = html
    // document.getElementById('goods-item1').innerHTML = html
    // document.getElementById('goods-item2').innerHTML = html
    // document.getElementById('goods-item3').innerHTML = html
  }
  window.addEventListener('hashchange', function () {
    let act_type = location.hash.replace('#','')
    dataType[act_type] || getGoods(act_type)
  })
  let timer = null
  window.addEventListener('scroll', function (e) {
    clearTimeout(timer)
    timer = setTimeout(function () {
      let scrollTop = document.documentElement.scrollTop
      let containers = document.getElementsByClassName('goods-container')
      for (let item of containers ){
        if(scrollTop - item.offsetTop < 200){
          let id = item.getAttribute('id')
          if(id === 'living'){
            getLive()
          }else {
            dataType[id] || getGoods(id)
          }
          break
        }
      }
      for (let item of containers ){
        if(scrollTop - item.offsetTop > 100 && scrollTop - item.offsetTop < 300){
          let id = item.getAttribute('id')
          for(let child of document.getElementsByClassName('nav')[0].children){
            child.className = ''
          }
          document.getElementById(`nav-${id}`).className = 'hover'
          break
        }
      }
    },50)
  })
  return {
    start:function () {
      getGoods('temai')
      getLive()

    }
  }
}
let app = new Init()
app.start()
