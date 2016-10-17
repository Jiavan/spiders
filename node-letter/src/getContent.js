var Observer = require('./observer');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var superagent = require('superagent');

var observer = new Observer();
var cursor = 0;
var stack = [];
var dbHandler = null;
var refeCollection = null;
var contentCollection = null;
var insertCount = 0;
var arrLength = 0;
var DB_CONN_STR = config.DB_CONN_STR;
const LIST_MAX = 10;
const PAGE_CONTENT = 'pageContent';
const PAGE_REFE = 'pageReference';

var getStack = function (cursor, callback) {
  refeCollection.find({}, {skip: cursor, limit: LIST_MAX, fields: {url: 1}}).toArray(function (err, res) {
    if (err) {
      console.log(err);
      return;
    }
    arrLength = res.length;
    callback && callback(res);
  });
};

var getContent = function (urls) {
  urls.forEach(function (item, idx) {
    superagent
      .get(item.url)
      .end(function (err, res) {
        if (err) {
          console.log(err);
        }

        var $ = cheerio.load(res.text);
        var data = {
          title: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_title').text(),
          author: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_askname').text(),
          time: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_asktime').text(),
          category: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_category').text(),
          responesor: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_answername').text(),
          subtitle: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_MailContent').text()
        };

        contentCollection.insert(data, function (err, res) {
          if (err) {
            console.log(err);
          }
          console.log('insert ' + data.title);
          observer.publish('insertData', ++insertCount);
        });
      });
  });
};

MongoClient.connect(DB_CONN_STR, function (err, res) {
  if (err) {
    console.log(err);
    return;
  }

  dbHandler = res;
  refeCollection = dbHandler.collection(PAGE_REFE);
  contentCollection = dbHandler.collection(PAGE_CONTENT);

  observer.publish('connectDB');
});

observer.subscribe('connectDB', function () {
  getStack(cursor, getContent);
});

observer.subscribe('insertData', function (args) {
  if (args === arrLength) {
    insertData = 0;
    cursor += arrLength;
    getStack(cursor, getContent);
  }
});
