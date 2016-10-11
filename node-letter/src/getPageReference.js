var superagent = require('superagent');
var cheerio = require('cheerio');
var mongo = require('./mongo');
var Observer = require('./observer');
var getPage = require('./getPage');
var data = [];
var dbHandler = {};
const READ_COLLECTION = 'pageState';
const SAVE_COLLECTION = 'pageReference';
const BASE_PATH = 'http://cs.cqut.edu.cn/DeanMail/';

var observer = new Observer();

var getPageReference = function (pageId) {
  getPage(pageId, function (res) {
    var $ = cheerio.load(res.text);
    $('#ctl00_ContentPlaceHolder_main_DeanMailList1_GridView1 tbody tr').each(function(idx, item) {
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
      }
    });
    console.log(data);
  });
};

// mongo.connect(READ_COLLECTION, function(res) {
//   dbHandler = res;
//   mongo.selectData(dbHandler.collection, {
//     pageId: {
//       $gt: 0
//     }
//   }, function(stateCollection) {
//     observer.push('getState', stateCollection);
//   });
// });
//
//
// observer.subscribe('getState', function (stateCollection) {
//   stateCollection.forEach(function (item, idx) {
//     getPageReference(item.pageId);
//   });
// });
