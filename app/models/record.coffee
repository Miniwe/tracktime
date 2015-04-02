class Tracktime.Record extends Backbone.Model
  idAttribute: "_id"
  urlRoot: config.ROOT + '/records'
  localStorage: new Backbone.LocalStorage ('records-backbone')

  defaults:
    _id: null
    subject: ''
    description: ''
    date: () -> (new Date()).getTime()
    project: 0
    isDeleted: false
    # order: Tracktime.RecordsCollection.nextOrder()

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'


  initialize: (options, params, any) ->
    # @set 'date', new Date(parseInt(options.date || (new Date()).getTime(), 10))

  isValid: () ->
    # @todo add good validation
    true

  sync: (method, model, options) ->
    options = options or {}
    switch method
      when 'create'
        if options.ajaxSync
          _success = options.success
          _model = model.clone()
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            _model.id = model._id
            _model.set '_id', model._id
            Backbone.sync method, _model, options
        Backbone.sync method, model, options
      when 'delete'
        model.save {'isDeleted': true}, {ajaxSync: false}
        if options.ajaxSync
          _success = options.success
          _model = model
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            Backbone.sync method, _model, options

        Backbone.sync method, model, options
      else
        $.alert "unknown method #{method}"
        Backbone.sync method, model, options

(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
