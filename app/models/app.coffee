class Tracktime extends Backbone.Model
  urlRoot: config.ROOT

  defaults:
    title: "TrackTime App - from"
    isOnline: false

  initialize: () ->
    @set 'isOnline', @checkOnline()
    @populateActions()
    @listenTo @, "change:isOnline", @populateRecords
    @setWindowListeners()

  checkOnline: () ->
    (window.navigator.onLine == true) or false

  setWindowListeners: () ->
    window.addEventListener "offline", (e) =>
      $.alert "offline"
      @set 'isOnline', false
    , false

    window.addEventListener "online", (e) =>
      $.alert "online"
      @set 'isOnline', true
    , false


  populateRecords: () ->
    @set 'records', new Tracktime.RecordsCollection()
    @trigger 'render_records'

  addRecord: (params) ->
    newRecord = new Tracktime.Record _.extend {date: (new Date()).getTime()}, params
    if newRecord.isValid()
      @get('records').add newRecord
      newRecord.save {},
        ajaxSync: Tracktime.AppChannel.request 'isOnline'
        success: (result) =>
          $.alert
            content: 'save success'
            timeout: 4000
            style: 'btn-primary'

          @get('actions').getActive().successAdd()
        error: () =>
          $.alert 'save error'

    else
      $.alert 'Erros validation from add record to collection'

  populateActions: () ->
    @set 'actions', new Tracktime.ActionsCollection Tracktime.initdata.tmpActions

(module?.exports = Tracktime) or @Tracktime = Tracktime
