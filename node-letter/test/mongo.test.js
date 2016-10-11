var mongo = require('../src/mongo');

mongo.connect('pageState', function (res) {
  var dbHandler = res;
  mongo.selectData(dbHandler.collection, {pageId: {$gt:0}}, function (res) {
    console.log(res.length);
    dbHandler.db.close();
  });
});
