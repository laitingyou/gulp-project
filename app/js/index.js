const Init = function() {
  let dataType={

  }
  const getGoods=function () {
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
    }
  }
}
let app = new Init()
app.start()
