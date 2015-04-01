class Tracktime extends Backbone.Model
  urlRoot: "/"

  defaults:
    title: "TrackTime App - from"
    isOnline: false

  initialize: () ->
    @populateActions()
    @listenTo @, "change:isOnline", @populateRecords
    return

  populateRecords: () ->
    @set 'records', new Tracktime.RecordsCollection()
    @trigger 'render_records'

  addRecord: (params) ->
    newRecord = new Tracktime.Record _.extend {date: (new Date()).getTime()}, params
    if newRecord.isValid()
      newRecord.save {},
        ajaxSync: Tracktime.AppChannel.request 'isOnline'
        success: (result) =>
          $.alert 'save success'
          # @todo next 2 lines remove - all update  only on update
          #     localstorage from server sync (!)
          #     if no sync will be sync on online and update views
          @get('records').add newRecord
          @get('actions').getActive().successAdd()
        error: () =>
          $.alert 'save error'

    else
      $.alert 'Erros validation from add record to collection'

  populateActions: () ->
    @set 'actions', new Tracktime.ActionsCollection Tracktime.initdata.tmpActions

(module?.exports = Tracktime) or @Tracktime = Tracktime
