class Tracktime.Model extends Backbone.Model
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
      when 'read'
        Backbone.sync method, model, options
      when 'patch'
        Backbone.sync method, model, options
      when 'update'
        if options.ajaxSync
          _success = options.success
          _model = model
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            Backbone.sync method, _model, options
        Backbone.sync method, model, options
      when 'delete'
        if options.ajaxSync == true
          model.save {'isDeleted': true}, {ajaxSync: false}
          _success = options.success
          _model = model
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            Backbone.sync method, _model, options
          Backbone.sync method, model, options
        else
          Backbone.sync method, model, options
      else
        $.alert "unknown method #{method}"
        Backbone.sync method, model, options