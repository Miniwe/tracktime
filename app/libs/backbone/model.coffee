_.extend Backbone.Model.prototype,
  urlRoot: (url) -> [window.config.ROOT, url].join ''
