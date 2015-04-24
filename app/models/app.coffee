class Tracktime extends Backbone.Model
  urlRoot: config.SERVER

  defaults:
    title: "TrackTime App"

  initialize: () ->

  initCollections: ->
    @set 'users', new Tracktime.UsersCollection()
    @set 'records', new Tracktime.RecordsCollection()
    @set 'projects', new Tracktime.ProjectsCollection()
    @set 'actions', new Tracktime.ActionsCollection()
    @listenTo Tracktime.AppChannel, "isOnline", @updateApp

  uninitCollections: ->
    @unset 'users'
    @unset 'actions'
    @unset 'records'
    @unset 'projects'
    @stopListening Tracktime.AppChannel, "isOnline"

  updateApp: ->
    @get('users').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    @get('records').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    @get('projects').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  callAuth: ->

  changeUserStatus: (status) ->
    if status == true
      @initCollections()
      Tracktime.AppChannel.command 'userAuth'
    else
      @uninitCollections()
      Tracktime.AppChannel.command 'userGuest'



(module?.exports = Tracktime) or @Tracktime = Tracktime
