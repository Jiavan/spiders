var superagent = require('superagent');
var cheerio = require('cheerio');
var mongo = require('./mongo');

var targetUrl = 'http://cs.cqut.edu.cn/DeanMail/MailList.aspx';
var pageId = process.argv.slice(2)[0];
var dbHandler = {}
var data;
var pid = Math.floor(pageId / 10) * 10 + 1;
const COLLECTION = 'pageState';

if (pageId % 10 === 1) {
  pid -= 10;
}
mongo.connect(COLLECTION ,function (res) {
  console.log('connect success');
  dbHandler = res;
  mongo.selectData(dbHandler.collection, { pageId: pid }, function (res) {
    dbHandler.db.close();

    if ((res instanceof Array) && res.length) {
      data = {
        __EVENTTARGET: 'ctl00$ContentPlaceHolder_main$DeanMailList1$GridView1',
        __EVENTARGUMENT: 'Page$' + pageId,
        __VIEWSTATE: res[0].__VIEWSTATE,
        __EVENTVALIDATION: res[0].__EVENTVALIDATION
      };
    } else {
      data = null;
    }

    superagent
      .post(targetUrl)
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'ASP.NET_SessionId=yqknhl45hxw0t255d54r2u45',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
      })
      .send(data)
      .end(function (err, res) {
       if (err) {
         console.log(err);
         return;
       }

       var $ = cheerio.load(res.text);
       $('#ctl00_ContentPlaceHolder_main_DeanMailList1_GridView1 [align="left"] a').each(function (idx, el) {
         $ = cheerio.load(el);
         console.log($('a').attr('title'));
       });
      });
  });
});
