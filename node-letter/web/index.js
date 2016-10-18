var express = require('express');
var template = require('art-template');
var MongoClient = require('mongodb').MongoClient;
var config = require('../src/config');
var DB_CONN_STR = config.DB_CONN_STR;
const PAGE_REFE = 'pageReference';
const PAGE_CONTENT = 'pageContent';
var app = express();

app.get('/', function (req, res) {

  var limit = parseInt(req.query.limit) || 100;
  var skip = parseInt(req.query.skip) || 0;
  MongoClient.connect(DB_CONN_STR, function (err, db) {
    var collection = db.collection(PAGE_REFE);
    collection.find({}, {sort: {pageView: -1}, skip: skip, limit: limit}).toArray(function (err, list) {
      var data = {};
      data.list = list;
      data.index = true;
      db.close();
      var html = template(__dirname + '/tpl', data);

      res.send(html);
    });
  });
});

app.get('/content', function (req, res) {
  MongoClient.connect(DB_CONN_STR, function (err, db) {
    var collection = db.collection(PAGE_CONTENT);
    collection.find({}, {sort: {textLength: -1}, limit: 100}).toArray(function (err, list) {
      var data = {};
      data.list = list;
      db.close();
      var html = template(__dirname + '/tpl', data);

      res.send(html);
    });
  });
});

app.listen(23333, function () {
  console.log('running at 23333');
});
