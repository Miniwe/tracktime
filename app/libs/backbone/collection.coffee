_.extend Backbone.Collection.prototype,
  urlRoot: (url) -> [Tracktime.config.ROOT, url].join ''
