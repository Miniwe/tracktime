class Tracktime extends Backbone.Model
  urlRoot: "/"

  defaults:
    title: "TrackTime App - from"

  initialize: () ->
    @populateActions()
    return

  populateRecords: () ->
    @set 'records', new Tracktime.RecordsCollection Tracktime.initdata.tmpRecords
    @trigger 'update_records'

  populateActions: () ->
    @set 'actions', new Tracktime.ActionsCollection Tracktime.initdata.tmpActions

(module?.exports = Tracktime) or @Tracktime = Tracktime
