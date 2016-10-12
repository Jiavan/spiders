var superagent = require('superagent');
var cheerio = require('cheerio');
var mongo = require('./mongo');
var Observer = require('./observer');
var getPage = require('./getPage');
var data = [];
var dbHandler = {};
var currentPage = 1;
var observer = new Observer();
const BASE_PATH = 'http://cs.cqut.edu.cn/DeanMail/';

var getReference = function (res) {

  var $ = cheerio.load(res.text);
  $('#ctl00_ContentPlaceHolder_main_DeanMailList1_GridView1').find('tr').each(function(idx, item) {
    var $ = cheerio.load(item);
    var links = $('td a');
    var info = {};

    if (links.length === 4) {
      info = {
        category: $(links[0]).text().trim().slice(1, -1),
        title: $(links[1]).text().trim(),
        pageView: $(links[2]).text().trim(),
        time: new Date($(links[3]).text().trim()).getTime(),
        url: BASE_PATH + $(links[1]).attr('href')
      };
      info.title && data.push(info);
    } else {
      console.log('done');
      return;
    }
  });
  mongo.insertData(dbHandler.collection, data, function (res) {
    observer.publish('nextPage', ++currentPage);
    data.length = 0;
  });
  console.log(data);
};

observer.subscribe('nextPage', function (args) {
  getPage(args, getReference);
});

mongo.connect('pageReference', function (res) {
  dbHandler = res;

  for (var i = 0; i < 5; i++, currentPage++) {
    getPage(currentPage, getReference);
  }
});
