class Tracktime extends Backbone.Model
  urlRoot: config.SERVER

  defaults:
    title: "TrackTime App"

  initialize: () ->
    @set 'users', new Tracktime.UsersCollection()
    @set 'actions', new Tracktime.ActionsCollection()
    @set 'records', new Tracktime.RecordsCollection()
    @set 'projects', new Tracktime.ProjectsCollection()

    @listenTo Tracktime.AppChannel, "isOnline", @updateApp

  updateApp: ->
    @get('users').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    @get('records').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    @get('projects').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'


(module?.exports = Tracktime) or @Tracktime = Tracktime
