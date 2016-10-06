var events = require('events');
var EventEmitter = events.EventEmitter;
var watcher = new EventEmitter();

watcher.on('log', function () {
  console.log('jiavan');
});

watcher.on('log', function () {
  console.log('jiavan2');
})

watcher.once('log');
