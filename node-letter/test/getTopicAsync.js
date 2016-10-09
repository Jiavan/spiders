var superagent = require('superagent');
var cheerio = require('cheerio');
var Observer = require('./observer');
var mongo = require('./mongo');
var fs = require('fs');

const baseUrl = 'http://cs.cqut.edu.cn/DeanMail/DeanMailContent.aspx?MailID=';
const observer = new Observer();



var parseTextAndSave = function (text) {
  var $ = cheerio.load(text);
  var content = $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_MailContent').text();

  console.log(content);
  // fs.writeFile('content.html', content, function (err, res) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   console.log('write file success');
  // });
};

var getTopicAsync = function(pageId) {
  if (!pageId) {
    console.log('page id is null');
    return;
  }

  pageId = parseInt(pageId, 10) || 1;
  superagent
    .get(baseUrl + pageId)
    .end(function(err, res) {
      if (err) {
        console.log(err.message);
        return;
      }

      parseTextAndSave(res.text);
    });
}

getTopicAsync(process.argv.slice(2)[0]);
