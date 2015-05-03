class Tracktime extends Backbone.Model
  urlRoot: config.SERVER

  defaults:
    title: 'TrackTime App'
    authUser: null

  initialize: () ->
    @set 'authUser', new Tracktime.User.Auth()
    @listenTo @get('authUser'), 'change:authorized', @changeUserStatus

    @listenTo @get('authUser'), 'destroy', ->
      @set 'authUser', new Tracktime.User.Auth()
      @listenTo @get('authUser'), 'change:authorized', @changeUserStatus

  initCollections: ->
    @set 'users', new Tracktime.UsersCollection()
    @set 'records', new Tracktime.RecordsCollection()
    @set 'projects', new Tracktime.ProjectsCollection()
    @set 'actions', new Tracktime.ActionsCollection()
    @listenTo Tracktime.AppChannel, "isOnline", @updateApp

  unsetCollections: ->
    @unset 'users'
    @unset 'actions'
    @unset 'records'
    @unset 'projects'
    @stopListening Tracktime.AppChannel, "isOnline"

  updateApp: ->
    @get('users').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    @get('records').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    @get('projects').fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  changeUserStatus: ->
    @setUsetStatus @get('authUser').get('authorized')

  setUsetStatus: (status) ->
    if status == true
      @initCollections()
      Tracktime.AppChannel.command 'userAuth'
    else
      @unsetCollections()
      Tracktime.AppChannel.command 'userGuest'



(module?.exports = Tracktime) or @Tracktime = Tracktime
