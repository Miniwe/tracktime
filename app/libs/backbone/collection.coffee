_.extend Backbone.Collection.prototype,
  urlRoot: (url) -> [window.config.ROOT, url].join ''
