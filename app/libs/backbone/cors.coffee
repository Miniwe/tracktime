do ->
  proxiedSync = Backbone.sync

  Backbone.sync = (method, model, options) ->
    options or (options = {})
    if !options.crossDomain
      options.crossDomain = true
    if !options.xhrFields
      options.xhrFields = withCredentials: true
    proxiedSync method, model, options

  return
