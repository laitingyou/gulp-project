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
  let dataType={

  }
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
  const getGoods=function (act_id) {
    request({
      url:'https://www.eelly.test/index.php',
      method: 'get',
      callback: 'callback',
      args:{
        app:'activity',
        act: 'activityGoods',
        act_id,
      },
      success(res){
        dataType[act_id] = res
        let tpl = document.getElementById('live-tpl').innerHTML
        let template = Handlebars.compile(tpl)
        var context = {list:[1,2,3,4,5,6,7,8], name: "zhaoshuai", content: "learn Handlebars"};
        var html = template(context);
        document.getElementById('live').innerHTML = html
      },
      fail(err){
        console.log(err)
      }
    })
  }
  const  getLive=function (pamater) {
    let tpl = document.getElementById('good-tpl').innerHTML
    let template = Handlebars.compile(tpl)
    var context = {list:[1,2,3,4,5,6,7,8], name: "zhaoshuai", content: "learn Handlebars"};
    var html = template(context);
    document.getElementById('goods-item').innerHTML = html
    document.getElementById('goods-item1').innerHTML = html
    document.getElementById('goods-item2').innerHTML = html
    document.getElementById('goods-item3').innerHTML = html
  }
  window.addEventListener('hashchange', function () {
    let act_id = location.hash.replace('#','')
    console.log(navHash[act_id])
    dataType[act_id] || getGoods(navHash[act_id])
  })
  return {
    start:function () {
      getGoods(9921)
      getLive()

    }
  }
}
let app = new Init()
app.start()
