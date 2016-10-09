var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var eventproxy = require('eventproxy');
var ep = new eventproxy();
var targetUrl = 'http://cs.cqut.edu.cn/DeanMail/MailList.aspx#';
var path = 'http://cs.cqut.edu.cn/DeanMail/';

superagent
  .get(targetUrl)
  .end(function (err, res) {
    if (err) {
      console.log(err.message);
      return;
    }

    var $ = cheerio.load(res.text);
    var __EVENTVALIDATION = $('#__EVENTVALIDATION').val();
    var __VIEWSTATE = $('#__VIEWSTATE').val();

    superagent
      .post(targetUrl)
      .set({
        // 'Content-Length': '13304',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'ASP.NET_SessionId=yqknhl45hxw0t255d54r2u45',
        // 'Host': 'cs.cqut.edu.cn',
        // 'Origin': 'http://cs.cqut.edu.cn',
        // 'Referer': 'http://cs.cqut.edu.cn/DeanMail/MailList.aspx',
        // 'Upgrade-Insecure-Requests': '1',
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

        if (err) {
          console.log(err);
          return;
        }

        var $ = cheerio.load(res.text);
        var topics = [];

        $("#ctl00_ContentPlaceHolder_main_DeanMailList1_GridView1 td[align='left'] a").each(function (idx, el) {
          var $ = cheerio.load(el);
          topics.push({
            title: $('a').attr('title'),
            href: url.resolve(path, $('a').attr('href'))
          });
        });
        console.log(topics);
        console.log('done!');
      });
  });
