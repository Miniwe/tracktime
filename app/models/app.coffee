class Tracktime extends Backbone.Model
  urlRoot: config.SERVER

  defaults:
    title: "TrackTime App - from"
    isOnline: null

  initialize: () ->
    @checkServer() if @checkOnline()
    @setWindowListeners()

    @populateActions()
    @set 'records', new Tracktime.RecordsCollection()

    @listenTo @, "change:isOnline", @updateApp

  checkOnline: () ->
    (window.navigator.onLine == true) or false

  checkServer: () ->
    deferred = $.Deferred()
    callback = (args...) -> console.log 'call', args...
    try
      $.ajax
        url: "#{config.SERVER}/status"
        async: false
        dataType: 'jsonp'
        jsonp: 'callback'
        success: (result) =>
          @set 'isOnline', true
          deferred.resolve()
        error: (result) =>
          deferred.resolve()
    catch exception_var
      @set 'isOnline', false
    return deferred.promise()

  setWindowListeners: () ->
    window.addEventListener "offline", (e) =>
      @set 'isOnline', false
    , false

    window.addEventListener "online", (e) =>
      @checkServer()
    , false

  updateApp: () ->
    @get('records').fetch
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: () => @trigger 'render_records'

  addRecord: (params) ->
    _.extend params, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'save success'
        timeout: 2000
        style: 'btn-primary'
      @get('actions').getActive().successAdd()
    error = () =>
      $.alert 'save error'
    @get('records').addRecord params,
      success: success,
      error: error


  populateActions: () ->
    @set 'actions', new Tracktime.ActionsCollection Tracktime.initdata.tmpActions

(module?.exports = Tracktime) or @Tracktime = Tracktime
