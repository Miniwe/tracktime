class Tracktime extends Backbone.Model
  urlRoot: config.ROOT

  defaults:
    title: "TrackTime App - from"
    isOnline: false

  initialize: () ->
    @checkServer() if @checkOnline()
    @populateActions()
    @listenTo @, "change:isOnline", @populateRecords
    @setWindowListeners()

  checkOnline: () ->
    (window.navigator.onLine == true) or false

  setWindowListeners: () ->
    window.addEventListener "offline", (e) =>
      @set 'isOnline', false
    , false

    window.addEventListener "online", (e) =>
      @checkServer()
    , false


  checkServer: () ->
    deferred = $.Deferred()
    $.ajax
      url: config.SERVER
      async: false
      success: (result) =>
        @set 'isOnline', true
        deferred.resolve()
      error: (result) =>
        @set 'isOnline', false
        deferred.resolve()
    return deferred.promise()


  populateRecords: () ->
    @set 'records', new Tracktime.RecordsCollection()
    @trigger 'render_records'


  addRecord: (params) ->
    _.extend params, {date: (new Date()).getTime()}
    success = (result) =>
      $.alert
        content: 'save success'
        timeout: 4000
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
