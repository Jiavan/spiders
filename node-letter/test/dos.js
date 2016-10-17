var superagent = require('superagent');

setInterval(function functionName() {
  superagent.get('http://luck06.hei.gmybfv.cn/01/50/2016/indexo.asp', function () {
    console.log('dos');
  });
}, 10);
