var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');
var Observer = require('./observer');
var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl).end(function (err, res) {
  if (err) {
    console.log(err);
  }

  var topicUrls = [];
  var $ = cheerio.load(res.text);
  $('#topic_list .topic_title').each(function (idx, el) {
    var $el = $(el);
    var href = url.resolve(cnodeUrl, $el.attr('href'));
    topicUrls.push(href);
  });

  var observer = new Observer();
  var stack = [];
  var worker = 0;
  const MAX_CONNECT = 5;

  observer.subscribe('fetched', function () {
    stack.length && stack.pop()();
  });

  topicUrls.forEach(function (topicUrl, idx) {
    stack.push(function () {
      superagent.get(topicUrl).end(function (err, res) {
        console.log('fetch ' + topicUrl + ' successful');
        observer.publish('fetched');
      });
    });
  });

  console.log(stack.length);
  for (var i = 0; i < MAX_CONNECT; i++) {
    stack.pop()();
  }
});
