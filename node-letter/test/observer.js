function Observer() {
  this._handlers = {};
}

Observer.prototype = {
  constructor: Observer,
  subscribe: function subscribe(type, callback) {
    if (typeof type === 'string' && typeof callback === 'function') {
      if (typeof this._handlers[type] === 'undefined') {
        this._handlers[type] = [];
      }
      this._handlers[type].push(callback);
    }
  },
  publish: function publish(type, args) {
    if (this._handlers[type] instanceof Array) {
      var handlers = this._handlers[type];

      handlers.forEach(function (callback, idx) {
        callback(args);
      });
    }
  },
  unsubscribe: function unsubscribe(type, callback) {
    if (this._handlers[type] instanceof Array) {
      var handlers = this._handlers[type];

      for (var i = 0; i < handlers.length; i++) {
        if (callback === handlers[i]) {
          handlers.splice(i, 1);
          break;
        }
      }
    }
  }
};

module.exports = Observer;
