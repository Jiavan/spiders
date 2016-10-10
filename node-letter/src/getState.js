var mongo = require('./mongo');
var superagent = require('superagent');
var cheerio = require('cheerio');
var Observer = require('./observer');
var config = require('./config');
var Log = require('./log');
var observer = new Observer();
var state = {};
var dbHandler = {};
var start;
const COLLECTION = 'pageState';

observer.subscribe('fetched', function (data) {

  // get next page
  var $ = cheerio.load(data.res.text);
  var __VIEWSTATE = $('#__VIEWSTATE').val();
  var __EVENTVALIDATION = $('#__EVENTVALIDATION').val();
  var pageId = data.pageId;

  var insertData = {
    pageId,
    __VIEWSTATE,
    __EVENTVALIDATION
  };
  mongo.insertData(dbHandler.collection, insertData, function () {
    console.log('insert a pices of data' + pageId);
    Log.logPageState((new Date()) + '\tinsert data ' + pageId + '\n');
  });

  getState(__VIEWSTATE, __EVENTVALIDATION, pageId + 10);
});

function getState(__VIEWSTATE, __EVENTVALIDATION, pageId) {

  var data = {
    __EVENTTARGET: 'ctl00$ContentPlaceHolder_main$DeanMailList1$GridView1',
    __EVENTARGUMENT: 'Page$' + pageId,
    __VIEWSTATE,
    __EVENTVALIDATION
  };

  if (pageId === 1) {
    data = null;
  }

  superagent
    .post(config.URL_LIST)
    .set({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': 'ASP.NET_SessionId=yqknhl45hxw0t255d54r2u45',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36'
    })
    .send(data)
     .end(function (err, res) {
       if (err) {
         console.log(err.message);
         console.log('done!');
         Log.logPageState((new Date()) + '\tdone!\n');
         Log.logPageState('speed ' + (Date.now() - start) + 's');
         dbHandler.db.close();
         return;
       }

       observer.publish('fetched', { res, pageId });
     });
}

start = Date.now();
mongo.connect(COLLECTION ,function (res) {
  dbHandler = res;
  console.log('connect mongo success');
  Log.logPageState((new Date()) + '\tget state spider start...\n');
  getState(null, null, 1);
});
