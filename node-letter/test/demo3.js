var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var targetUrl = 'http://cs.cqut.edu.cn/DeanMail/MailList.aspx#';
var path = 'http://cs.cqut.edu.cn/DeanMail/';

superagent
  .post(targetUrl)
  .set({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie': 'ASP.NET_SessionId=yqknhl45hxw0t255d54r2u45',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
  })
  .send({
    __EVENTTARGET: 'ctl00$ContentPlaceHolder_main$DeanMailList1$GridView1',
    __EVENTARGUMENT: 'Page$21',
    __VIEWSTATE: __VIEWSTATE,
    __EVENTVALIDATION: __EVENTVALIDATION
   })
   .end(function (err, res) {
     if (err) {
       console.log(err);
       return;
     }

     var $ = cheerio.load(res.text);
     console.log($);
   });
