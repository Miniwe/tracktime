class Tracktime extends Backbone.Model
  urlRoot: config.SERVER

  defaults:
    title: "TrackTime App - from"

  initialize: () ->

    @populateActions()
    @set 'records', new Tracktime.RecordsCollection()

    @listenTo Tracktime.AppChannel, "isOnline", @updateApp

  updateApp: ->
    console.log 'updateApp', Tracktime.AppChannel.request 'isOnline'
    @get('records').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    # console.log 'update app global function'

  addRecord: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'save success'
        timeout: 2000
        style: 'btn-primary'
      @get('actions').getActive().successAdd()
    error = () =>
      $.alert 'save error'
    @get('records').addRecord options,
      success: success,
      error: error

  populateActions: () ->
    @set 'actions', new Tracktime.ActionsCollection Tracktime.initdata.tmpActions

(module?.exports = Tracktime) or @Tracktime = Tracktime
