class Tracktime extends Backbone.Model
  urlRoot: config.SERVER

  defaults:
    title: "TrackTime App - from"

  initialize: () ->
    @set 'actions', new Tracktime.ActionsCollection()
    @set 'records', new Tracktime.RecordsCollection()

    @listenTo Tracktime.AppChannel, "isOnline", @updateApp

  updateApp: ->
    @get('records').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  addRecord: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'save success'
        timeout: 2000
        style: 'btn-success'
      @get('actions').getActive().successAdd()
    error = () =>
      $.alert 'save error'
    @get('records').addRecord options,
      success: success,
      error: error

(module?.exports = Tracktime) or @Tracktime = Tracktime
