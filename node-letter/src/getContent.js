var Observer = require('./observer');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var superagent = require('superagent');
var log = require('./log');

var observer = new Observer();
var cursor = 0;
var stack = [];
var dbHandler = null;
var refeCollection = null;
var contentCollection = null;
var insertCount = 0;
var arrLength = 0;
var start = 0;
var DB_CONN_STR = config.DB_CONN_STR;
const LIST_MAX = 200;
const PAGE_CONTENT = 'pageContent';
const PAGE_REFE = 'pageReference';
start = new Date().getTime();

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
          console.log(err.message);
        } else if (res) {
          var $ = cheerio.load(res.text);
          var data = {
            title: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_title').text(),
            author: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_askname').text(),
            time: new Date($('#ctl00_ContentPlaceHolder_main_DeanMailContent1_asktime').text()).getTime(),
            category: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_category').text(),
            responesor: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_answername').text(),
            subtitle: $('#ctl00_ContentPlaceHolder_main_DeanMailContent1_MailContent').text(),
            url: 'http://cs.cqut.edu.cn/DeanMail/' + $('#aspnetForm').attr('action'),
            textLength: $('#DeanMail').text().length
          };

          contentCollection.insert(data, function (err, res) {
            if (err) {
              console.log(err);
            }
            console.log('insert ' + data.title);
            log.logPageContent('insert ' + data.title + '\n');
          });
        }

        observer.publish('insertData', ++insertCount);
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
  console.log(args, arrLength);
  if (args === arrLength) {
    insertCount = 0;
    cursor += arrLength;
    getStack(cursor, getContent);
  }

  if (arrLength !== LIST_MAX) {
    console.log('done!\nspeed ' + ((new Date().getTime() - start) / 1000 / 1000));
    log.logPageContent('done!\nspeed ' + ((new Date().getTime() - start) / 1000 / 1000));
  }
});
