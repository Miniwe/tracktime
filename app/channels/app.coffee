Tracktime.AppChannel = Backbone.Radio.channel 'app'

_.extend Tracktime.AppChannel,
  isOnline: null
  userStatus: null
  router: null

  init: ->
    @on 'isOnline', (status) => @isOnline = status
    @on 'userStatus', (status) => @changeUserStatus status
    @checkOnline()
    @setWindowListeners()
    @model = new Tracktime()
    @bindComply()
    @bindRequest()
    return @

  checkOnline: ->
    if window.navigator.onLine == true
      @checkServer()
    else
      @trigger 'isOnline', false

  checkServer: ->
    deferred = $.Deferred()

    serverOnlineCallback = (status) => @trigger 'isOnline', true

    successCallback = (result) =>
      @trigger 'isOnline', true
      deferred.resolve()

    errorCallback = (jqXHR, textStatus, errorThrown) =>
      @trigger 'isOnline', false
      deferred.resolve()

    try
      $.ajax
        url: "#{config.SERVER}/status"
        async: false
        dataType: 'jsonp'
        jsonpCallback: 'serverOnlineCallback'
        success: successCallback
        error: errorCallback
    catch exception_var
      @trigger 'isOnline', false

    return deferred.promise()

  setWindowListeners: ->
    window.addEventListener "offline", (e) =>
      @trigger 'isOnline', false
    , false

    window.addEventListener "online", (e) =>
      @checkServer()
    , false

  bindComply: ->
    @comply
      'start':           @startApp
      'newRecord':       @newRecord
      'newProject':      @newProject
      'newUser':         @newUser
      'useProject':      @useProject
      'addAction':       @addAction
      'serverOnline':    @serverOnline
      'serverOffline':   @serverOffline
      'checkOnline':     @checkOnline
      'userAuth':        @userAuth
      'userGuest':       @userGuest
      'activeRecord':       @activeRecord

  bindRequest: ->
    @reply 'isOnline', => @isOnline
    @reply 'userStatus', => @userStatus
    @reply 'projects', => @model.get 'projects'
    @reply 'users', => @model.get 'users'
    @reply 'projectsList', => {}
    @reply 'usersList', => {}

  startApp: ->
    Backbone.history.start
      pushState: false

  newRecord: (options) ->
    _.extend options, user: @model.get('authUser').id
    @model.get('records').addRecord(options)

  newProject: (options) ->
    @model.get('projects').addProject(options)

  newUser: (options) ->
    @model.get('users').addUser(options)

  addAction: (options, params) ->
    action = @model.get('actions').addAction(options, params)
    action.setActive()

  activeRecord: (record) ->
    @model.get('authUser').setActiveRecord record

  serverOnline: ->
    @trigger 'isOnline', true

  useProject: (id) ->
    @model.get('projects').useProject id

  serverOffline: ->
    @trigger 'isOnline', false

  userAuth: ->
    @trigger 'userStatus', true

  userGuest: ->
    @trigger 'userStatus', false

  changeUserStatus: (status) ->
    # @todo here get user session - if success status true else false
    if @router != null
      @router.view.close()
      delete @router.view

    if status == true
      @router = new Tracktime.AppRouter model: @model
      @trigger 'isOnline', @isOnline
    else
      @router = new Tracktime.GuestRouter model: @model

  checkActive: (id) ->
    id == @model.get('authUser').get('activeRecord')

(module?.exports = Tracktime.AppChannel) or @Tracktime.AppChannel = Tracktime.AppChannel
