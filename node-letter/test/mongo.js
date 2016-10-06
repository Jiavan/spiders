var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:12345/test';
var db = null;
var collection = null;

var insertData = function(collection, data, callback) {
  collection.insert(data, function (err, res) {
    if (err) {
      console.log(err);
      return;
    }

    callback && callback(res);
  });
};

var selectData = function(collection, whereStr, callback) {
  collection.find(whereStr).toArray(function (err, res) {
    if (err) {
      console.log(err);
      return;
    }

    callback && callback(res);
  });
};

var updateData = function(collection, whereStr, updateStr, callback) {
  collection.update(whereStr, updateStr, function (err, res) {
    if (err) {
      console.log(err);
      return;
    }

    callback && callback(res);
  });
};

var removeData = function(collection, whereStr, callback) {
  collection.remove(whereStr, function(err, res) {
    if (err) {
      console.log(err);
      return;
    }

    callback && callback(res);
  });
};

MongoClient.connect(DB_CONN_STR, function (err, dbHandler) {
  if (err) {
    console.log(err);
    return;
  }

  db = dbHandler;
  collection = db.collection('user');

  console.log('mongodb connect successful');
  // insertData(collection, [{
  //   name: 'jiavan',
  //   age: 20
  // }, {
  //   name: 'liziyang',
  //   age: 21
  // }], function (res) {
  //   console.log(res);
  //   db.close();
  // });

  // updateData(collection, {
  //   name: 'jiavanaaa'
  // }, {
  //   $set: {
  //     name: 'jiavan',
  //   }
  // }, function (res) {
  //   console.log(res);
  //   db.close();
  // });

  // selectData(collection, {name: 'jiavan'}, function (res) {
  //   console.log(res);
  //   db.close();
  // })

  removeData(collection, {
    name: 'jiavan'
  }, function (res) {
    console.log(res);
    db.close();
  })
});
