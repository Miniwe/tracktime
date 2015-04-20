Tracktime.AppChannel = Backbone.Radio.channel 'app'

_.extend Tracktime.AppChannel,
  isOnline: null

  init: ->
    @listenTo @, 'isOnline', (status) => @isOnline = status
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
      'addAction':       @addAction
      'serverOnline':    @serverOnline
      'serverOffline':   @serverOffline
      'checkOnline':     @checkOnline

  bindRequest: ->
    @reply 'isOnline', => @isOnline
    @reply 'projects', => @model.get 'projects'

  startApp: ->
    @router = new Tracktime.AppRouter model: @model
    Backbone.history.start
      pushState: false

  newRecord: (options) ->
    @model.get('records').addRecord(options)

  newProject: (options) ->
    @model.get('projects').addProject(options)

  newUser: (options) ->
    @model.get('users').addUser(options)

  addAction: (options, params) ->
    action = @model.get('actions').addAction(options, params)
    action.setActive()

  serverOnline: ->
    @trigger 'isOnline', true

  serverOffline: ->
    @trigger 'isOnline', false


(module?.exports = Tracktime.AppChannel) or @Tracktime.AppChannel = Tracktime.AppChannel
