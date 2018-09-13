const Init = function() {
  let dataType={

  }
  const request = function ({
    url,
    method='post',
    args={}
                            }) {
    let query = ''
    for (let i in args){
      query += `?${i}=${args[i]}&`
    }
    console.log(query.slice(-1))
    var xhr = new XMLHttpRequest();
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.open('post', '02.post.php' );
    xhr.send('name=fox&age=18');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
      }
    };
  }
  const getGoods=function (pamater) {
    let tpl = document.getElementById('live-tpl').innerHTML
    let template = Handlebars.compile(tpl)
    var context = {list:[1,2,3,4,5,6,7,8], name: "zhaoshuai", content: "learn Handlebars"};
    var html = template(context);
    document.getElementById('live').innerHTML = html
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
    console.log(location.hash)
  })
  return {
    start:function () {
      getGoods()
      getLive()
      request({
        args:{
          a:1,b:23
        }
      })
    }
  }
}
let app = new Init()
app.start()
