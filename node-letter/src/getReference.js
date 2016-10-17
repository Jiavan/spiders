var superagent = require('superagent');
var cheerio = require('cheerio');
var mongo = require('./mongo');
var Observer = require('./observer');
var getPage = require('./getPage');
var dbHandler = {};
var currentPage = 1;
var observer = new Observer();
const BASE_PATH = 'http://cs.cqut.edu.cn/DeanMail/';
const PAGE_REFE = 'pageReference';

var getReference = function (res) {

  var data = [];
  var $ = cheerio.load(res.text);
  $('#ctl00_ContentPlaceHolder_main_DeanMailList1_GridView1').find('tr').each(function(idx, item) {
    var $ = cheerio.load(item);
    var links = $('td a');
    var info = {};

    // 如果留言信息完整解析文档并入栈
    if (links.length === 4) {
      info = {
        category: $(links[0]).text().trim().slice(1, -1),
        title: $(links[1]).text().trim(),
        pageView: parseInt($(links[2]).text().trim()),
        time: new Date($(links[3]).text().trim()).getTime(),
        url: BASE_PATH + $(links[1]).attr('href')
      };
      info.title && data.push(info);
    }
  });

  // 如果栈不为空则插入数据并发布消息
  if (data.length) {
    mongo.insertData(dbHandler.collection, data, function (res) {
      observer.publish('nextPage', ++currentPage);
    });
  }
};

// 订阅nextPage事件，获取指定页码的信息，捕获page isn't exist异常并退出
observer.subscribe('nextPage', function (args) {
  try {
    getPage(args, getReference);
    console.log(args + 'item should be ' + (args * 25) + ' pices of data');
  } catch (e) {
    console.log(e.message);
    console.log('done');
    dbHandler.db.close();
    return;
  }
});

mongo.connect(PAGE_REFE, function (res) {
  dbHandler = res;
  getPage(currentPage, getReference);
});
