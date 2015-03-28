class Tracktime extends Backbone.Model
  urlRoot: "/"

  defaults:
    title: "TrackTime App - from"

  initialize: () ->
    @populateActions()
    return

  populateRecords: () ->
    @set 'records', new Tracktime.RecordsCollection Tracktime.initdata.tmpRecords
    @trigger 'render_records'

  addRecord: (params) ->
    newRecord = new Tracktime.Record _.extend {date: new Date()}, params
    if newRecord.isValid()
      @get('records').add newRecord
      @get('actions').getActive().successAdd()
    else
      $.alert 'Erros from add record to collection'


  populateActions: () ->
    @set 'actions', new Tracktime.ActionsCollection Tracktime.initdata.tmpActions

(module?.exports = Tracktime) or @Tracktime = Tracktime
