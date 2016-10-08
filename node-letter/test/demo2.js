var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var Observer = require('./observer');
var targetUrl = 'http://cs.cqut.edu.cn/DeanMail/MailList.aspx';
var path = 'http://cs.cqut.edu.cn/DeanMail/';
var observer = new Observer();
var formData = {};
var pageId = 1;

observer.subscribe('callNext', function (data) {
  pageId += 10;
  pageId < 50 && getState(pageId);
});

var getState = function (pageId) {
  var data = {
    __EVENTTARGET: 'ctl00$ContentPlaceHolder_main$DeanMailList1$GridView1',
    __EVENTARGUMENT: 'Page$' + pageId,
    __VIEWSTATE: formData.__VIEWSTATE,
    __EVENTVALIDATION: formData.__EVENTVALIDATION
  };

  data = (pageId === 1) ? null : data;

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
        console.log(err.message);
        return;
      }

      var $ = cheerio.load(res.text);
      formData = {
        __EVENTVALIDATION: $('#__EVENTVALIDATION').val(),
        __VIEWSTATE: $('#__VIEWSTATE').val()
      };

      console.log(formData);
      console.log('------------------------');

      observer.publish('callNext', formData);
    });
}

getState(pageId);
