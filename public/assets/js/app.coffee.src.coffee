process = process or window.process or {}


production =
  SERVER: 'https://ttpms.herokuapp.com'
  collection:
    records: 'records'
    projects: 'projects'
    actions: 'actions'
    users: 'users'
test =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records'
    projects: 'projects'
    actions: 'actions'
    users: 'users'
development =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records'
    projects: 'projects'
    actions: 'actions'
    users: 'users'


switch process.env?.NODE_ENV
  when 'production'
    config = production
  when 'test'
    config = test
  else
    config = development

(module?.exports = config) or @config = config

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

class Tracktime.AdminView extends Backbone.View
  el: '#panel'
  className: ''
  template: JST['admin/index']
  views: {}

  initialize: ->
    @render()

  render: ->
    # $(document).title @model.get 'title'
    @$el.html @template()

  initUI: ->
    $.material.init()


(module?.exports = Tracktime.AdminView) or @Tracktime.AdminView = Tracktime.AdminView


do ->
  proxiedSync = Backbone.sync

  Backbone.sync = (method, model, options) ->
    options or (options = {})
    if !options.crossDomain
      options.crossDomain = true
    if !options.xhrFields
      options.xhrFields = withCredentials: true
    proxiedSync method, model, options

  return

Backbone.Validation.configure
  # selector: 'class_v'
  # labelFormatter: 'label_v'
  # attributes: 'inputNames' # returns the name attributes of bound view input elements
  # forceUpdate: true


_.extend Backbone.Model.prototype, Backbone.Validation.mixin

Backbone.ViewMixin =
  close: () ->
    @onClose() if @onClose

    @undelegateEvents()
    @$el.removeData().unbind()
    @remove();
    Backbone.View.prototype.remove.call @
    return

  onClose: ->
    for own key, view of @views
      view.close(key)

  setSubView: (key, view) ->
    @views[key].close() if @views[key]?
    @views[key] = view

  getSubView: (key) ->
    @views[key] if @views[key]

Backbone.View.prototype extends Backbone.ViewMixin

Handlebars.registerHelper 'link_to', (options) ->
  attrs = href: ''
  for own key, value of options.hash
    if key is 'body'
      body = Handlebars.Utils.escapeExpression value
    else
      attrs[key] = Handlebars.Utils.escapeExpression value
  new (Handlebars.SafeString) $("<a />", attrs).html(body)[0].outerHTML


Handlebars.registerHelper 'safe_val', (value, safeValue) ->
  out = value || safeValue
  new Handlebars.SafeString(out)


Handlebars.registerHelper 'nl2br', (text) ->
  text = Handlebars.Utils.escapeExpression text
  new Handlebars.SafeString text.nl2br()

Handlebars.registerHelper 'dateFormat', (date) ->
  date
  # timestamp = Date.parse date
  # unless _.isNaN(timestamp)
  #   (new Date(timestamp)).toLocalString()
  # else
  #   new Date()

Handlebars.registerHelper 'minuteFormat', (val) ->
  currentHour = val / 720 * 12
  hour = Math.floor(currentHour)
  minute = Math.round((currentHour - hour) * 60)
  "#{hour}:#{minute}"

Handlebars.registerHelper 'placeholder', (name) ->
  placeholder = "<placeholder id='#{name}'></placeholder>"
  new Handlebars.SafeString placeholder
(($) ->
  snackbarOptions =
    content: ''
    style: ''
    timeout: 2000
    htmlAllowed: true

  $.extend (
    alert: (params) ->
      if _.isString params
        snackbarOptions.content = params
      else
        snackbarOptions = $.extend {},snackbarOptions,params
      $.snackbar snackbarOptions
  )
) jQuery
String::capitalizeFirstLetter = ->
  @charAt(0).toUpperCase() + @slice(1)

String::nl2br = ->
  (@ + '').replace /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2'

class Tracktime.Collection extends Backbone.Collection
  addModel: (params, options) ->
    newModel = new @model params
    if newModel.isValid()
      @add newModel
      unless options.ajaxSync?
        options.ajaxSync = Tracktime.AppChannel.request 'isOnline'
      newModel.save {}, options
    else
      $.alert 'Erros validation from add curModel to collection'

  fetch: (options) ->
    @resetLocalStorage()
    if options? and options.ajaxSync == true
      _success = options.success
      options.success = (collection, response, optionsSuccess) =>
        @syncCollection(response)
        _success.apply(@, collection, response, options) if _.isFunction(_success)
    super options

  syncCollection: (models) ->
    # по всем remote model которые вроде как в коллекции уже
    _.each models, (model) =>
      curModel = @get(model._id)
      localModel = @localStorage.find curModel
      # если нет локальной то сохраняем (локально)
      unless localModel
        curModel.save ajaxSync: false
      # иначе
      else
        # если локальная старее то обновляем с новых данных (локально)
        modelLastAccess = (new Date(model.lastAccess)).getTime()
        localLastAccess = (new Date(localModel.lastAccess)).getTime()
        if localModel.isDeleted
          # do nothing
          curModel.set {'isDeleted': true},  {trigger: false}
        else if localLastAccess < modelLastAccess
          curModel.save model, ajaxSync: false
        # иначе есть если локальная новее то
        else if localLastAccess > modelLastAccess
          # обновляем модель пришедшую в коллекции
          # сохраняем ее удаленно
          curModel.save localModel, ajaxSync: true

    # по всем local моделям
    localModels = @localStorage.findAll()
    _.each _.clone(localModels), (model) =>
      collectionModel = @get(model._id)
      # если удалена
      if model.isDeleted
        if model._id.length > 24
          destroedModel = new @model {_id: model._id, subject: 'model to delete'}
          destroedModel.destroy ajaxSync: false
        else
          modelLastAccess = (new Date(model.lastAccess)).getTime()
          if collectionModel? and modelLastAccess > (new Date(collectionModel.get('lastAccess'))).getTime()
            destroedModel = collectionModel
          else
            destroedModel = new @model (model)
          # то удаляем локально и удаленно
          # и из коллекции если есть
          destroedModel.destroy ajaxSync: true
      else
        # если нет в коллекции
        unless collectionModel
          replacedModel = new @model {_id: model._id}
          replacedModel.fetch {ajaxSync: false}
          newModel = replacedModel.toJSON()
          delete newModel._id
          # то сохраняем ее удаленно
          # добавляем в коллекцию
          @addModel newModel,
            success: (model, response) =>
              # заменяем на новосохраненную
              replacedModel.destroy {ajaxSync: false}


  resetLocalStorage: () ->
    @localStorage = new Backbone.LocalStorage @collectionName


(module?.exports = Tracktime.Collection) or @Tracktime.Collection = Tracktime.Collection

class Tracktime.Model extends Backbone.Model
  sync: (method, model, options) ->
    options = options or {}
    switch method
      when 'create'
        if options.ajaxSync
          _success = options.success
          _model = model.clone()
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            _model.id = model._id
            _model.set '_id', model._id
            Backbone.sync method, _model, options
        Backbone.sync method, model, options
      when 'read'
        Backbone.sync method, model, options
      when 'patch'
        Backbone.sync method, model, options
      when 'update'
        if options.ajaxSync
          _success = options.success
          _model = model
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            Backbone.sync method, _model, options
        Backbone.sync method, model, options
      when 'delete'
        if options.ajaxSync == true
          model.save {'isDeleted': true}, {ajaxSync: false}
          _success = options.success
          _model = model
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            Backbone.sync method, _model, options
          Backbone.sync method, model, options
        else
          Backbone.sync method, model, options
      else
        $.alert "unknown method #{method}"
        Backbone.sync method, model, options
class Tracktime.Action extends Backbone.Model

  idAttribute: "_id"
  collectionName: config.collection.actions
  url: '/actions' #receive on activate actions for user (!)

  defaults:
    _id: null
    title: 'Default action'
    isActive: null
    isVisible: false
    canClose: false

  attributes: () ->
    id: @model.cid

  setActive: () ->
    @collection.setActive @

  processAction: (options) ->
    $.alert 'Void Action'

(module?.exports = Tracktime.Action) or @Tracktime.Action = Tracktime.Action

class Tracktime.Action.Project extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add project'
    projectModel: null
    formAction: '#'
    btnClass: 'btn-material-purple'
    btnClassEdit: 'btn-material-blue'
    navbarClass: 'navbar-inverse'
    icon:
      className: 'mdi-content-add-circle'
      classNameEdit: 'mdi-content-add-circle-outline'
      letter: ''
    isActive: null
    isVisible: true

  initialize: () ->
    @set 'projectModel', new Tracktime.Project() unless @get('projectModel') instanceof Tracktime.Project

  processAction: () ->
    projectModel = @get 'projectModel'
    if projectModel.isValid()
      if projectModel.isNew()
        Tracktime.AppChannel.command 'newProject', projectModel.toJSON()
        projectModel.clear().set(projectModel.defaults)
      else
        projectModel.save {},
          ajaxSync: Tracktime.AppChannel.request 'isOnline'
          success: () =>
            $.alert
              content: 'Project: update success'
              timeout: 2000
              style: 'btn-success'
            @destroy()

  destroy: (args...) ->
    @get('projectModel').isEdit = false
    @get('projectModel').trigger 'change:isEdit'
    super args...


(module?.exports = Tracktime.Action.Project) or @Tracktime.Action.Project = Tracktime.Action.Project

class Tracktime.Action.Record extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add record'
    recordModel: null
    formAction: '#'
    btnClass: 'btn-material-green'
    btnClassEdit: 'btn-material-lime'
    navbarClass: 'navbar-primary'
    icon:
      className: 'mdi-action-bookmark'
      classNameEdit: 'mdi-action-bookmark-outline'
      letter: ''
    isActive: null
    isVisible: true

  initialize: () ->
    @set 'recordModel', new Tracktime.Record() unless @get('recordModel') instanceof Tracktime.Record

  processAction: () ->
    recordModel = @get 'recordModel'
    if recordModel.isValid()
      if recordModel.isNew()
        Tracktime.AppChannel.command 'newRecord', recordModel.toJSON()
        recordModel.clear().set(recordModel.defaults)
      else
        recordModel.save {},
          ajaxSync: Tracktime.AppChannel.request 'isOnline'
          success: () =>
            $.alert
              content: 'Record: update success'
              timeout: 2000
              style: 'btn-success'
            @destroy()

  destroy: (args...) ->
    @get('recordModel').isEdit = false
    @get('recordModel').trigger 'change:isEdit'
    super args...


(module?.exports = Tracktime.Action.Record) or @Tracktime.Action.Record = Tracktime.Action.Record

class Tracktime.Action.Search extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Search'
    formAction: '#'
    btnClass: 'btn-white'
    btnClassEdit: 'btn-white'
    navbarClass: 'navbar-material-light-blue'
    icon:
      className: 'mdi-action-search'
      classNameEdit: 'mdi-action-search'
      letter: ''
    isActive: null
    isVisible: true

  initialize: (options = {}) ->
    @set options

  processAction: (options) ->
    @search()

  search: () ->
    $.alert 'search start'

(module?.exports = Tracktime.Action.Search) or @Tracktime.Action.Search = Tracktime.Action.Search

class Tracktime.Action.User extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add user'
    userModel: null
    formAction: '#'
    btnClass: 'btn-material-deep-orange'
    btnClassEdit: 'btn-material-amber'
    navbarClass: 'navbar-material-yellow'
    icon:
      className: 'mdi-social-person'
      classNameEdit: 'mdi-social-person-outline'
      letter: ''
    isActive: null
    isVisible: true

  initialize: () ->
    @set 'userModel', new Tracktime.User() unless @get('userModel') instanceof Tracktime.User

  processAction: () ->
    userModel = @get 'userModel'
    if userModel.isValid()
      if userModel.isNew()
        Tracktime.AppChannel.command 'newUser', userModel.toJSON()
        userModel.clear().set(userModel.defaults)
      else
        userModel.save {},
          ajaxSync: Tracktime.AppChannel.request 'isOnline'
          success: () =>
            $.alert
              content: 'User: update success'
              timeout: 2000
              style: 'btn-success'
            @destroy()

  destroy: (args...) ->
    @get('userModel').isEdit = false
    @get('userModel').trigger 'change:isEdit'
    super args...


(module?.exports = Tracktime.Action.User) or @Tracktime.Action.User = Tracktime.Action.User

class Tracktime.Project extends Tracktime.Model
  idAttribute: "_id"
  collectionName: config.collection.projects
  urlRoot: config.SERVER + '/' + 'projects'
  localStorage: new Backbone.LocalStorage 'projects'

  defaults:
    _id: null
    name: ''
    description: ''
    lastAccess: (new Date()).toISOString()
    isDeleted: false

  validation:
    name:
      required: true
      minLength: 4
      msg: 'Please enter a valid name'

  initialize: ->
    @isEdit = false
    @on 'change:name', @updateLastAccess
    @on 'change:isEdit', @changeIsEdit

  isValid: () ->
    # @todo add good validation
    true

  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()

  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit project', type: 'Project', canClose: true},
        title: 'Edit project: ' + @get('name').substr(0, 40)
        projectModel: @
        scope: 'edit:action'


(module?.exports = Tracktime.Project) or @Tracktime.Project = Tracktime.Project

class Tracktime.Record extends Tracktime.Model
  idAttribute: "_id"
  collectionName: config.collection.records
  urlRoot: config.SERVER + '/' + 'records'
  localStorage: new Backbone.LocalStorage 'records'

  defaults:
    _id: null
    subject: ''
    description: ''
    date: () -> (new Date()).toISOString()
    lastAccess: (new Date()).toISOString()
    recordDate: ''
    recordTime: 0
    project: 0
    isDeleted: false

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'

  initialize: ->
    @isEdit = false
    @on 'change:subject change:recordTime change:recordDate change:project', @updateLastAccess
    @on 'change:isEdit', @changeIsEdit

  isValid: ->
    # @todo add good validation
    true

  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()


  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit record', type: 'Record', canClose: true},
        title: 'Edit record: ' + @get('subject').substr(0, 40)
        recordModel: @
        scope: 'edit:action'


(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record

class Tracktime.User extends Tracktime.Model
  idAttribute: "_id"
  collectionName: config.collection.users
  urlRoot: config.SERVER + '/' + 'users'
  localStorage: new Backbone.LocalStorage 'users'

  defaults:
    _id: null
    name: ''
    description: ''
    lastAccess: (new Date()).toISOString()
    isDeleted: false

  validation:
    name:
      required: true
      minLength: 4
      msg: 'Please enter a valid name'

  initialize: ->
    @isEdit = false
    @on 'change:name', @updateLastAccess
    @on 'change:isEdit', @changeIsEdit

  isValid: () ->
    # @todo add good validation
    true

  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()

  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit user', type: 'User', canClose: true},
        title: 'Edit user: ' + @get('name').substr(0, 40)
        userModel: @
        scope: 'edit:action'


(module?.exports = Tracktime.User) or @Tracktime.User = Tracktime.User

class Tracktime.ActionsCollection extends Backbone.Collection
  model: Tracktime.Action
  collectionName: config.collection.actions
  url: '/actions'
  localStorage: new Backbone.LocalStorage @collectionName
  defaultActions: [
    { title: 'Add Record', type: 'Record' }
    { title: 'Search', type: 'Search' }
  ]
  active: null

  initialize: ->
    @on 'remove', @setDefaultActive
    _.each @defaultActions, @addAction

  addAction: (action, params = {}) =>
    @push new Tracktime.Action[action.type] _.extend action, params if (Tracktime.Action[action.type])

  setDefaultActive: ->
    @at(0).setActive() unless @findWhere isActive: true

  setActive: (active) ->
    @active?.set 'isActive', false
    active.set 'isActive', true
    @active = active
    @trigger 'change:active', @active

  getActive: -> @active

  getActions: ->
    _.filter @models, (model) -> model.get('isVisible')

(module?.exports = Tracktime.ActionsCollection) or @Tracktime.ActionsCollection = Tracktime.ActionsCollection

class Tracktime.ProjectsCollection extends Tracktime.Collection
  model: Tracktime.Project
  collectionName: config.collection.projects
  url: config?.SERVER + '/projects'
  urlRoot: config?.SERVER + '/projects'
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    # @fetch ajaxSync: Tracktime.AppChannel.reply 'isOnline'


  comparator: (model) ->
    - (new Date(model.get('date'))).getTime()

  addProject: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'Project: save success'
        timeout: 2000
        style: 'btn-success'
    error = () =>
      $.alert 'Project: save error'
    @addModel options,
      success: success,
      error: error


(module?.exports = Tracktime.ProjectsCollection) or @Tracktime.ProjectsCollection = Tracktime.ProjectsCollection

class Tracktime.RecordsCollection extends Tracktime.Collection
  model: Tracktime.Record
  collectionName: config.collection.records
  url: config?.SERVER + '/records'
  urlRoot: config?.SERVER + '/records'
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    # @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  comparator: (model) ->
    - (new Date(model.get('date'))).getTime()

  addRecord: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'Record: save success'
        timeout: 2000
        style: 'btn-success'
    error = () =>
      $.alert 'Record: save error'
    @addModel options,
      success: success,
      error: error


(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection

class Tracktime.UsersCollection extends Tracktime.Collection
  model: Tracktime.User
  collectionName: config.collection.users
  url: config?.SERVER + '/users'
  urlRoot: config?.SERVER + '/users'
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    # @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  addUser: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'User: save success'
        timeout: 2000
        style: 'btn-success'
    error = () =>
      $.alert 'User: save error'
    @addModel options,
      success: success,
      error: error


(module?.exports = Tracktime.UsersCollection) or @Tracktime.UsersCollection = Tracktime.UsersCollection

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
    @reply 'projects', => []

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

class Tracktime.ActionView extends Backbone.View
  tagName: 'li'
  className: 'btn'
  events:
    'click a': 'setActive'

  initialize: () ->
    # _.bindAll @model, 'change:isActive', @update

  setActive: () ->
    @model.setActive()

(module?.exports = Tracktime.ActionView) or @Tracktime.ActionView = Tracktime.ActionView


class Tracktime.ActionsView extends Backbone.View
  el: '#actions-form'
  menu: '#actions-form'
  template: JST['actions/actions']
  views: {}

  initialize: (options) ->
    _.extend @, options

    @listenTo @collection, 'change:active', @renderAction
    @listenTo @collection, 'add', @addAction
    @render()

  render: () ->
    @$el.html @template()
    @menu = $('.dropdown-menu', '.select-action', @$el)
    _.each @collection.getActions(), @addAction
    @collection.at(0).setActive()

  addAction: (action) =>
    listBtn = new Tracktime.ActionView.ListBtn model: action
    @menu.append listBtn.$el
    @setSubView "listBtn-#{listBtn.cid}", listBtn
    $('[data-toggle="tooltip"]', listBtn.$el).tooltip()

  renderAction: (action) ->
    if Tracktime.ActionView[action.get('type')]
      @$el.parents('.navbar').attr 'class', "navbar #{action.get('navbarClass')} shadow-z-1"
      @setSubView "actionDetails", new Tracktime.ActionView[action.get('type')] model: action


(module?.exports = Tracktime.ActionsView) or @Tracktime.ActionsView = Tracktime.ActionsView


class Tracktime.ActionView.ActiveBtn extends Backbone.View
  el: '#action_type'

  initialize: () ->
    @render()

  render: () ->
    model = @model.toJSON()
    if model.canClose
      model.btnClass = model.btnClassEdit
      model.icon.className = model.icon.classNameEdit
    @$el
      .attr 'class', "btn btn-fab #{model.btnClass} dropdown-toggle "
      .find('i').attr('title', model.title).attr('class', model.icon.className).html model.icon.letter


(module?.exports = Tracktime.ActionView.ActiveBtn) or @Tracktime.ActionView.ActiveBtn = Tracktime.ActionView.ActiveBtn


class Tracktime.ActionView.ListBtn extends Backbone.View
  tagName: 'li'
  template: JST['actions/listbtn']
  events:
    'click': 'actionActive'

  initialize: (options) ->
    _.extend @, options
    @render()
    @listenTo @model, 'change:isActive', @updateActionControl
    @listenTo @model, 'destroy', @close

  render: () ->
    model = @model.toJSON()
    if model.canClose
      model.btnClass = model.btnClassEdit
      model.icon.className = model.icon.classNameEdit
    @$el.html @template model
    if @model.get('isActive') == true
      @$el.addClass 'active'
      @updateActionControl()
    else
      @$el.removeClass 'active'

  actionActive: (event) ->
    event.preventDefault()
    @model.setActive()

  updateActionControl: () ->
    @$el.siblings().removeClass 'active'
    @$el.addClass 'active'
    $("#action_type").replaceWith (new Tracktime.ActionView.ActiveBtn model: @model).$el


(module?.exports = Tracktime.ActionView.ListBtn) or @Tracktime.ActionView.ListBtn = Tracktime.ActionView.ListBtn


class Tracktime.ActionView.Project extends Backbone.View
  container: '.action-wrapper'
  template: JST['actions/details/project']
  views: {}
  events:
    'click #send-form': 'sendForm'
    'input textarea': 'textareaInput'

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()

    textarea = new Tracktime.Element.Textarea
      model: @model.get 'projectModel'
      placeholder: @model.get 'title'
      field: 'name'

    $('placeholder#textarea', @$el).replaceWith textarea.$el

    $.material.input "[name=#{textarea.name}]"
    textarea.$el.textareaAutoSize().focus()
    textarea.on 'tSubmit', @sendForm

    $('placeholder#btn_close_action', @$el).replaceWith (new Tracktime.Element.ElementCloseAction
      model: @model
    ).$el if @model.get 'canClose'

  textareaInput: (event) =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".details-container").toggleClass 'hidden', _.isEmpty $(event.currentTarget).val()
    , 500

  sendForm: () =>
    @model.processAction()

(module?.exports = Tracktime.ActionView.Project) or @Tracktime.ActionView.Project = Tracktime.ActionView.Project


class Tracktime.ActionView.Record extends Backbone.View
  container: '.action-wrapper'
  template: JST['actions/details/record']
  views: {}
  events:
    'click #send-form': 'sendForm'
    'input textarea': 'textareaInput'

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()

    textarea = new Tracktime.Element.Textarea
      model: @model.get 'recordModel'
      placeholder: @model.get 'title'
      field: 'subject'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    $.material.input "[name=#{textarea.name}]"
    textarea.$el.textareaAutoSize().focus()
    window.setTimeout () =>
      textarea.$el.trigger 'input'
    , 100

    textarea.on 'tSubmit', @sendForm

    $('placeholder#slider', @$el).replaceWith (new Tracktime.Element.Slider
      model: @model.get 'recordModel'
      field: 'recordTime'
    ).$el

    $('placeholder#selectday', @$el).replaceWith (new Tracktime.Element.SelectDay
      model: @model.get 'recordModel'
      field: 'recordDate'
    ).$el

    projectDefinition = new Tracktime.Element.ProjectDefinition
      model: @model.get 'recordModel'
      field: 'project'

    $('.floating-label', "#actions-form").append projectDefinition.$el

    $('placeholder#btn_close_action', @$el).replaceWith (new Tracktime.Element.ElementCloseAction
      model: @model
    ).$el if @model.get 'canClose'

    $('[data-toggle="tooltip"]').tooltip()

  textareaInput: (event) ->
    diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
    $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
    $(".details-container").toggleClass 'hidden', _.isEmpty $(event.target).val()

  sendForm: () =>
    @model.processAction()

(module?.exports = Tracktime.ActionView.Record) or @Tracktime.ActionView.Record = Tracktime.ActionView.Record


class Tracktime.ActionView.Search extends Backbone.View
  container: '.action-wrapper'
  template: JST['actions/details/search']
  tmpDetails: {}
  views: {}

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()

(module?.exports = Tracktime.ActionView.Search) or @Tracktime.ActionView.Search = Tracktime.ActionView.Search


class Tracktime.ActionView.User extends Backbone.View
  container: '.action-wrapper'
  template: JST['actions/details/user']
  views: {}
  events:
    'click #send-form': 'sendForm'
    'input textarea': 'textareaInput'

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()

    textarea = new Tracktime.Element.Textarea
      model: @model.get 'userModel'
      placeholder: @model.get 'title'
      field: 'name'

    $('placeholder#textarea', @$el).replaceWith textarea.$el

    $.material.input "[name=#{textarea.name}]"
    textarea.$el.textareaAutoSize().focus()
    textarea.on 'tSubmit', @sendForm

    $('placeholder#btn_close_action', @$el).replaceWith (new Tracktime.Element.ElementCloseAction
      model: @model
    ).$el if @model.get 'canClose'

  textareaInput: (event) =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".details-container").toggleClass 'hidden', _.isEmpty $(event.target).val()
    , 500

  sendForm: () =>
    @model.processAction()

(module?.exports = Tracktime.ActionView.User) or @Tracktime.ActionView.User = Tracktime.ActionView.User


class Tracktime.AdminView.Header extends Backbone.View
  container: '#header'
  template: JST['admin/layout/header']

  initialize: (options) ->
    @render()


  render: () ->
    $(@container).html @$el.html @template()

(module?.exports = Tracktime.AdminView.Header) or @Tracktime.AdminView.Header = Tracktime.AdminView.Header

class Tracktime.AdminView.ActionView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item'
  template: JST['actions/admin_action']
  events:
    'click .btn-call-action': "callAction"
    'click .edit.btn': "editAction"


  initialize: ->
    @render()

  render: ->
    @$el.html @template @model.toJSON()

  editAction: ->

  callAction: ->
    $.alert 'Test action call'


(module?.exports = Tracktime.AdminView.ActionView) or @Tracktime.AdminView.ActionView = Tracktime.AdminView.ActionView


class Tracktime.AdminView.ActionsView extends Backbone.View
  container: '#main'
  template: JST['admin/actions']
  templateHeader: JST['admin/actions_header']
  tagName: 'ul'
  className: 'list-group'
  views: {}
  actionsTypes: ['Project', 'Record', 'User', 'Search']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Actions'}
    @$el.prepend @templateHeader()
    @renderActionsList()

  renderActionsList: () ->
    _.each @actionsTypes, (atype) =>
      actionView =  new Tracktime.AdminView.ActionView model: new Tracktime.Action[atype]()
      @$el.append actionView.el
      @setSubView "atype-#{atype}", actionView
    , @


(module?.exports = Tracktime.AdminView.ActionsView) or @Tracktime.AdminView.ActionsView = Tracktime.AdminView.ActionsView


class Tracktime.AdminView.Dashboard extends Backbone.View
  container: '#main'
  template: JST['admin/dashboard']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template()

(module?.exports = Tracktime.AdminView.Dashboard) or @Tracktime.AdminView.Dashboard = Tracktime.AdminView.Dashboard


class Tracktime.AdminView.ProjectsView extends Backbone.View
  container: '#main'
  template: JST['admin/projects']
  tagName: 'ul'
  className: 'list-group'

  initialize: () ->
    @views = {}
    @render()
    @listenTo @collection, "reset", @resetProjectsList
    @listenTo @collection, "add", @addProject
    @listenTo @collection, "remove", @removeProject

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Projects'}
    @resetProjectsList()

  resetProjectsList: () ->
    _.each @collection.where(isDeleted: false), (project) =>
      projectView =  new Tracktime.AdminView.ProjectView { model: project }
      @$el.append projectView.el
      @setSubView "project-#{project.cid}", projectView
    , @

  addProject: (project, collection, params) ->
    projectView = new Tracktime.AdminView.ProjectView { model: project }
    $(projectView.el).prependTo @$el
    @setSubView "project-#{project.cid}", projectView

  removeProject: (project, args...) ->
    projectView = @getSubView "project-#{project.cid}"
    projectView.close() if projectView

(module?.exports = Tracktime.AdminView.ProjectsView) or @Tracktime.AdminView.ProjectsView = Tracktime.AdminView.ProjectsView


class Tracktime.AdminView.UsersView extends Backbone.View
  container: '#main'
  template: JST['admin/users']
  tagName: 'ul'
  className: 'list-group'

  initialize: () ->
    @views = {}
    @render()
    @listenTo @collection, "reset", @resetUsersList
    @listenTo @collection, "add", @addUser
    @listenTo @collection, "remove", @removeUser

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Users'}
    @resetUsersList()

  resetUsersList: () ->
    _.each @collection.where(isDeleted: false), (user) =>
      console.log 'render user view'
      userView =  new Tracktime.AdminView.UserView { model: user }
      @$el.append userView.el
      @setSubView "user-#{user.cid}", userView
    , @

  addUser: (user, collection, params) ->
    userView = new Tracktime.AdminView.UserView { model: user }
    $(userView.el).prependTo @$el
    @setSubView "user-#{user.cid}", userView

  removeUser: (user, args...) ->
    userView = @getSubView "user-#{user.cid}"
    userView.close() if userView

(module?.exports = Tracktime.AdminView.UsersView) or @Tracktime.AdminView.UsersView = Tracktime.AdminView.UsersView


class Tracktime.AppView extends Backbone.View
  el: '#panel'
  className: ''
  template: JST['global/app']
  views: {}

  initialize: ->
    @render()

  render: ->
    # $(document).title @model.get 'title'
    @$el.html @template @model.toJSON()

  initUI: ->
    $.material.init()


(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView


class Tracktime.Element extends Backbone.View

  initialize: () ->
    @render()

  render: () ->
    @$el.html 'void element'


(module?.exports = Tracktime.Element) or @Tracktime.Element = Tracktime.Element


class Tracktime.Element.ElementCloseAction extends Tracktime.Element
  tagName: 'button'
  className: 'btn btn-close-action btn-fab btn-flat btn-fab-mini'
  hint: 'Cancel action'
  events:
    'click': 'closeAction'

  initialize: (options = {}) ->
    _.extend @, options
    @render()

  render: () ->
    @$el
      .attr 'title', @hint
      .append $('<i />', class: 'mdi-content-remove')

  closeAction: () =>
    @model.destroy()


(module?.exports = Tracktime.Element.ElementCloseAction) or @Tracktime.Element.ElementCloseAction = Tracktime.Element.ElementCloseAction


class Tracktime.Element.ProjectDefinition extends Tracktime.Element
  className: 'project_definition'
  template: JST['elements/project_definition']
  defaultTitle: 'Select project'
  events:
    'click .btn-white': 'selectProject'

  initialize: (options = {}) ->
    _.extend @, options
    @projects = Tracktime.AppChannel.request 'projects'
    @render()
    @projects.on 'sync', @renderProjectsList

  render: ->
    @$el.html @template
      title: @defaultTitle
    @renderProjectsList()

  renderProjectsList: =>
    console.log 'call renderProjectsList'
    @projects = Tracktime.AppChannel.request 'projects'
    console.log '@projects', @projects
    menu = $('.dropdown-menu', @$el)
    menu.children().remove()

    if @projects?
      @updateTitle()
      _.each @projects.models, (model) =>
        menu.append $("<li><a class='btn btn-white noDefault' data-project='#{model.get('_id')}' href='##{model.get('_id')}'>#{model.get('name')}</a></li>")

    menu.append $("<li><a class='btn btn-white' data-project='0' href='#0'><span class='text-muted'>No project</span></a></li>")

  getTitle: ->
    project_id = @model.get @field
    unless project_id == 0
      "to " + @projects.get(project_id).get 'name'
    else
      @defaultTitle

  selectProject: (event) =>
    event.preventDefault()
    @model.set @field, $(event.currentTarget).data 'project'
    @updateTitle()
    @$el.parents('.form-control-wrapper').find('textarea').focus()

  updateTitle: ->
    $('.project_definition-toggler span.caption', @$el).text @getTitle()


(module?.exports = Tracktime.Element.ProjectDefinition) or @Tracktime.Element.ProjectDefinition = Tracktime.Element.ProjectDefinition


class Tracktime.Element.SelectDay extends Tracktime.Element
  className: 'btn-group select-day'
  template: JST['elements/selectday']
  events:
    'click button.btn': 'setDay'

  initialize: (options = {}) ->
    # @tmpDetails.recordDate = $(".select-day > .btn .caption ruby rt").html()
    _.extend @, options
    @render()
    @changeField()
    @listenTo @model, "change:#{@field}", @changeField

  render: () ->
    @$el.html @template()

  changeField: () =>
    # @$el.val @model.get @field
    # найти в списке тот день который есть в field и нажать на эту кнопку

  changeInput: (value) =>
    @model.set @field, value, {silent: true}

  setDay: (event) ->
    event.preventDefault()
    $(".dropdown-toggle ruby", @$el).html $('ruby', event.currentTarget).html()
    @changeInput $(".dropdown-toggle ruby rt", @$el).html()


(module?.exports = Tracktime.Element.SelectDay) or @Tracktime.Element.SelectDay = Tracktime.Element.SelectDay


class Tracktime.Element.Slider extends Tracktime.Element
  className: 'slider shor btn-primary slider-material-orange'

  initialize: (options = {}) ->
    _.extend @, options
    @render()
    @changeField()
    @listenTo @model, "change:#{@field}", @changeField

  render: () ->
    @$el
      .noUiSlider
        start: [0]
        step: 5
        range: {'min': [ 0 ], 'max': [ 720 ] }
      .on
        slide: (event, inval) =>
          if inval? and _.isNumber parseFloat inval
            @changeInput parseFloat inval
            val = inval
          else
            val = 0
          currentHour = val / 720 * 12
          hour = Math.floor(currentHour)
          minute = (currentHour - hour) * 60
          $('.slider .noUi-handle').attr 'data-before', hour
          $('.slider .noUi-handle').attr 'data-after', Math.round(minute)
    @$el
      .noUiSlider_pips
        mode: 'values'
        values: [0,60*1,60*2,60*3,60*4,60*5,60*6,60*7,60*8,60*9,60*10,60*11,60*12]
        density: 2
        format:
          to: (value) -> value / 60
          from: (value) -> value

  changeField: () =>
    newVal = 0
    fieldValue = @model.get(@field)
    if fieldValue? and _.isNumber parseFloat fieldValue
      newVal = parseFloat @model.get @field
      @$el.val(newVal).trigger('slide')

  changeInput: (value) =>
    @model.set @field, parseFloat(value) or 0, {silent: true}


(module?.exports = Tracktime.Element.Slider) or @Tracktime.Element.Slider = Tracktime.Element.Slider


#<textarea class="form-control floating-label" placeholder="textarea floating label"></textarea>
class Tracktime.Element.Textarea extends Tracktime.Element
  name: 'action_text'
  tagName: 'textarea'
  className: 'form-control floating-label'
  events:
    'keydown': 'fixEnter'
    'keyup': 'changeInput'
    'change': 'changeInput'

  initialize: (options = {}) ->
    _.extend @, options
    @name = "#{@name}-#{@model.cid}"
    @render()
    @listenTo @model, "change:#{@field}", @changeField

  render: () ->
    @$el.attr 'name', @name
    @$el.attr 'placeholder', @placeholder
    @$el.val @model.get @field

  changeField: () =>
    @$el.val(@model.get @field).trigger('input')

  changeInput: (event) =>
    @model.set @field, $(event.target).val(), {silent: true}

  fixEnter: (event) =>
    if event.keyCode == 13 and not event.shiftKey
      event.preventDefault()
      @trigger 'tSubmit'


(module?.exports = Tracktime.Element.Textarea) or @Tracktime.Element.Textarea = Tracktime.Element.Textarea


class Tracktime.AppView.Footer extends Backbone.View
  container: '#footer'
  template: JST['layout/footer']
  events:
    'click #click-me': 'clickMe'
    'click #window-close': 'windowClose'

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template @model?.toJSON()

  clickMe: (event) ->
    event.preventDefault()
    $.alert 'Subview :: ' + $(event.target).attr 'href'

  windowClose: (event) ->
    event.preventDefault()
    $.alert 'Close window'
    window.close()


(module?.exports = Tracktime.AppView.Footer) or @Tracktime.AppView.Footer = Tracktime.AppView.Footer


class Tracktime.AppView.Header extends Backbone.View
  container: '#header'
  template: JST['layout/header']
  views: {}

  initialize: (options) ->
    @options = options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model?.toJSON()
    @views['actions'] = new Tracktime.ActionsView
      collection: @model.get('actions')

(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header

class Tracktime.AppView.Main extends Backbone.View
  container: '#main'
  template: JST['layout/main']
  views: {}

  initialize: () ->
    @render()
    @bindEvents()

  render: () ->
    $(@container).html @$el.html @template @model?.toJSON()
    @renderRecords()

  bindEvents: ->
    @listenTo @model.get('records'), "reset", @renderRecords

  renderRecords: ->
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.html recordsView.el




(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main


class Tracktime.AppView.Menu extends Backbone.View
  container: '#menu'
  template: JST['layout/menu']
  events:
    'change #isOnline': 'updateOnlineStatus'

  initialize: () ->
    @render()
    @bindEvents()

  bindEvents: ->
    @listenTo Tracktime.AppChannel, "isOnline", (status) ->
      $('#isOnline').prop 'checked', status
    slideout = new Slideout
      'panel': $('#panel')[0]
      'menu': $('#menu')[0]
      'padding': 256
      'tolerance': 70
    $("#menuToggler").on 'click', () -> slideout.toggle()

  updateOnlineStatus: (event) ->
    if $(event.target).is(":checked")
      Tracktime.AppChannel.command 'checkOnline'
    else
      Tracktime.AppChannel.command 'serverOffline'

  render: () ->
    $(@container).html @$el.html @template @model?.toJSON()
    _.each @model.get('projects').models, (model) =>
      projectLink = $('<a />', {class: 'list-group-item', href:"#projects/#{model.get('_id')}"}).html model.get('name')
      projectLink.appendTo "#projects-section .list-style-group"

(module?.exports = Tracktime.AppView.Menu) or @Tracktime.AppView.Menu = Tracktime.AppView.Menu


class Tracktime.AdminView.ProjectView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['projects/admin_project']
  events:
    'click .btn.delete': "deleteProject"
    'click .subject': "toggleInlineEdit"
    'click .edit.btn': "editProject"


  initialize: ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:name", @changeName
    @listenTo @model, "change:isEdit", @changeIsEdit
    @listenTo @model, "sync", @syncModel

  attributes: ->
    id: @model.cid

  render: ->
    @$el.html @template @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

    textarea = new Tracktime.Element.Textarea
      model: @model
      className: 'subject_edit form-control hidden'
      field: 'name'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.on 'tSubmit', @sendForm

  changeIsEdit: ->
    @$el.toggleClass 'editmode', @model.isEdit == true

  syncModel: (model, options, params) ->
    model.isEdit = false
    model.trigger 'change:isEdit'
    model.trigger 'change:name'
    #todo update all elements after

  changeIsDeleted: ->
    @$el.remove() # @todo possible not need

  changeName: ->
    $('.subject', @$el).html (@model.get('name') + '').nl2br()
    $('.name_edit', @$el).val @model.get 'name'

  toggleInlineEdit: ->
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'
    @$el.find('.subject_edit').textareaAutoSize().focus()

  sendForm: =>
    @toggleInlineEdit()
    @model.save {},
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'update project'
          timeout: 2000
          style: 'btn-info'

  editProject: ->
    $('.scrollWrapper').animate
      'scrollTop': @$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
    , 400, (event) =>
      @model.isEdit = true
      @model.trigger 'change:isEdit'

  deleteProject: (event) ->
    event.preventDefault()

    @model.destroy
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'delete project'
          timeout: 2000
          style: 'btn-danger'

(module?.exports = Tracktime.AdminView.ProjectView) or @Tracktime.AdminView.ProjectView = Tracktime.AdminView.ProjectView


class Tracktime.ProjectView extends Backbone.View
  container: '#main'
  template: JST['projects/project']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Project Details View HERE'}

(module?.exports = Tracktime.ProjectView) or @Tracktime.ProjectView = Tracktime.ProjectView


class Tracktime.ProjectsView extends Backbone.View
  container: '#main'
  template: JST['projecs/projecs']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Projects HERE - Only view'}

(module?.exports = Tracktime.ProjectsView) or @Tracktime.ProjectsView = Tracktime.ProjectsView


class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['records/record']
  events:
    'click .btn.delete': "deleteRecord"
    'click .subject': "toggleInlineEdit"
    'click .edit.btn': "editRecord"


  initialize: ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:subject", @changeSubject
    @listenTo @model, "change:project", @changeProject
    @listenTo @model, "change:isEdit", @changeIsEdit
    @listenTo @model, "sync", @syncModel

    # @projects = Tracktime.AppChannel.request 'projects'
    # @projects.on 'sync', (projects, models) => @renderProjectInfo projects

  attributes: ->
    id: @model.cid

  render: ->
    @$el.html @template @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

    textarea = new Tracktime.Element.Textarea
      model: @model
      className: 'subject_edit form-control hidden'
      field: 'subject'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.on 'tSubmit', @sendForm

    # @renderProjectInfo()

  changeIsEdit: ->
    @$el.toggleClass 'editmode', @model.isEdit == true

  syncModel: (model, options, params) ->
    model.isEdit = false
    model.trigger 'change:isEdit'
    model.trigger 'change:subject'
    #todo update all elements after

  changeIsDeleted: ->
    @$el.remove() # @todo possible not need

  changeSubject: ->
    $('.subject', @$el).html (@model.get('subject') + '').nl2br()
    $('.subject_edit', @$el).val @model.get 'subject'

  changeProject: ->
    @renderProjectInfo()

  renderProjectInfo: (projects) ->
    console.log 'renderProjectInfo', project
    project_id = @model.get('project')
    project = projects.get project_id
    if project instanceof Tracktime.Project
      $(".record-info-project span", @$el).html "#{project.get('name')}"
    else
      $(".record-info-project span", @$el).addClass 'hidden'

  toggleInlineEdit: ->
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'
    @$el.find('.subject_edit').textareaAutoSize().focus()

  sendForm: =>
    @toggleInlineEdit()
    @model.save {},
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'update record'
          timeout: 2000
          style: 'btn-info'

  editRecord: ->
    $('.scrollWrapper').animate
      'scrollTop': @$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
    , 400, (event) =>
      @model.isEdit = true
      @model.trigger 'change:isEdit'

  deleteRecord: (event) ->
    event.preventDefault()

    @model.destroy
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'delete record'
          timeout: 2000
          style: 'btn-danger'

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView


class Tracktime.RecordsView extends Backbone.View
  container: '#main'
  template: JST['records/records']
  tagName: 'ul'
  className: 'list-group'

  initialize: () ->
    @views = {}
    @render()
    @listenTo @collection, "reset", @resetRecordsList
    @listenTo @collection, "add", @addRecord
    @listenTo @collection, "remove", @removeRecord

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Records'}
    @resetRecordsList()

  resetRecordsList: () ->
    _.each @collection.where(isDeleted: false), (record) =>
      recordView =  new Tracktime.RecordView { model: record }
      @$el.append recordView.el
      @setSubView "record-#{record.cid}", recordView
    , @

  addRecord: (record, collection, params) ->
    recordView = new Tracktime.RecordView { model: record }
    $(recordView.el).prependTo @$el
    @setSubView "record-#{record.cid}", recordView

  removeRecord: (record, args...) ->
    recordView = @getSubView "record-#{record.cid}"
    recordView.close() if recordView

(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView


class Tracktime.ReportView extends Backbone.View
  container: '#main'
  template: JST['reports/report']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Report Details HERE'}

(module?.exports = Tracktime.ReportView) or @Tracktime.ReportView = Tracktime.ReportView


class Tracktime.ReportsView extends Backbone.View
  container: '#main'
  template: JST['reports/reports']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Reports HERE'}

(module?.exports = Tracktime.ReportsView) or @Tracktime.ReportsView = Tracktime.ReportsView


class Tracktime.AdminView.UserView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['users/admin_user']
  events:
    'click .btn.delete': "deleteUser"
    'click .subject': "toggleInlineEdit"
    'click .edit.btn': "editUser"


  initialize: ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:name", @changeName
    @listenTo @model, "change:isEdit", @changeIsEdit
    @listenTo @model, "sync", @syncModel

  attributes: ->
    id: @model.cid

  render: ->
    @$el.html @template @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

    textarea = new Tracktime.Element.Textarea
      model: @model
      className: 'subject_edit form-control hidden'
      field: 'name'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.on 'tSubmit', @sendForm

  changeIsEdit: ->
    @$el.toggleClass 'editmode', @model.isEdit == true

  syncModel: (model, options, params) ->
    model.isEdit = false
    model.trigger 'change:isEdit'
    model.trigger 'change:name'
    #todo update all elements after

  changeIsDeleted: ->
    @$el.remove() # @todo possible not need

  changeName: ->
    $('.subject', @$el).html (@model.get('name') + '').nl2br()
    $('.name_edit', @$el).val @model.get 'name'

  toggleInlineEdit: ->
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'
    @$el.find('.subject_edit').textareaAutoSize().focus()

  sendForm: =>
    @toggleInlineEdit()
    @model.save {},
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'update user'
          timeout: 2000
          style: 'btn-info'

  editUser: ->
    $('.scrollWrapper').animate
      'scrollTop': @$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
    , 400, (event) =>
      @model.isEdit = true
      @model.trigger 'change:isEdit'

  deleteUser: (event) ->
    event.preventDefault()

    @model.destroy
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'delete user'
          timeout: 2000
          style: 'btn-danger'

(module?.exports = Tracktime.AdminView.UserView) or @Tracktime.AdminView.UserView = Tracktime.AdminView.UserView


class Tracktime.UserView extends Backbone.View
  container: '#main'
  template: JST['users/user']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'User index'}

(module?.exports = Tracktime.UserView) or @Tracktime.UserView = Tracktime.UserView


class Tracktime.UserView.Details extends Backbone.View
  container: '#main'
  template: JST['users/details']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'User details HERE'}

(module?.exports = Tracktime.UserView.Details) or @Tracktime.UserView.Details = Tracktime.UserView.Details


class Tracktime.UserView.Rates extends Backbone.View
  container: '#main'
  template: JST['users/rates']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'User Rates'}

(module?.exports = Tracktime.UserView.Rates) or @Tracktime.UserView.Rates = Tracktime.UserView.Rates


$ ->

  Tracktime.AppChannel.init().command 'start'

  return

class Tracktime.AdminRouter extends Backbone.SubRoute
  routes:
    '':          'dashboard'
    'users':     'users'
    'projects':  'projects'
    'dashboard': 'dashboard'
    'actions':   'actions'

  initialize: (options) ->
    _.extend @, options

  dashboard: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.Dashboard()

  users: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.UsersView collection: @parent.model.get 'users'
    newAction = @parent.model.get('actions').addAction
      title: 'Add users'
      type: 'User'
    , scope: 'admin:users'
    newAction.setActive()

  projects: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.ProjectsView collection: @parent.model.get 'projects'
    newAction = @parent.model.get('actions').addAction
      title: 'Add projects'
      type: 'Project'
    , scope: 'admin:projects'
    newAction.setActive()

  actions: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.ActionsView collection: @parent.model.get 'actions'


(module?.exports = Tracktime.AdminRouter) or @Tracktime.AdminRouter = Tracktime.AdminRouter

class Tracktime.AppRouter extends Backbone.Router
  routes:
    '':                  'index'                #index
    'projects*subroute': 'invokeProjectsRouter' #Projects
    'reports*subroute':  'invokeReportsRouter'  #Reports
    'user*subroute':     'invokeUserRouter'     #User
    'admin*subroute':    'invokeAdminRouter'    #Admin
    '*actions':          'default'              #???

  initialize: (options) ->
    _.extend @, options
    @on 'route', (route, params) =>
      @removeActionsExcept(route) unless route.substr(0,6) == 'invoke'
    @initAuthInterface()

  addListener: (subroute, scope) ->
    @listenTo subroute, 'route', (route, params) =>
      @removeActionsExcept "#{scope}:#{route}"

  invokeProjectsRouter: (subroute) ->
    unless @projectsRouter
      @projectsRouter = new Tracktime.ProjectsRouter 'projects', parent: @
      @addListener @projectsRouter, 'projects'

  invokeReportsRouter: (subroute) ->
    unless @reportsRouter
      @reportsRouter = new Tracktime.ReportsRouter 'reports', parent: @
      @addListener @reportsRouter, 'reports'

  invokeUserRouter: (subroute) ->
    unless @userRouter
      @userRouter = new Tracktime.UserRouter 'user', parent: @
      @addListener @userRouter, 'users'

  invokeAdminRouter: (subroute) ->
    unless @adminRouter
      @adminRouter = new Tracktime.AdminRouter 'admin', parent: @
      @addListener @adminRouter, 'admin'

  initAuthInterface: () ->
    @view = new Tracktime.AppView model: @model
    @view.setSubView 'header', new Tracktime.AppView.Header model: @model
    @view.setSubView 'footer', new Tracktime.AppView.Footer()
    @view.setSubView 'menu', new Tracktime.AppView.Menu model: @model
    @view.initUI()

  index: ->
    @navigate 'projects', trigger: true, replace: false

  default: (actions) ->
    $.alert 'Unknown page'
    @navigate '', true

  removeActionsExcept: (route) ->
    _.each @model.get('actions').models, (action) ->
      action.destroy() if action && action.has('scope') and action.get('scope') isnt route


(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter


class Tracktime.ProjectsRouter extends Backbone.SubRoute
  routes:
    '':             'list'
    ':id':          'details'
    ':id/edit':     'edit'
    ':id/delete':   'delete'
    ':id/add':      'add'
    ':id/save':     'save'

  initialize: (options) ->
    _.extend @, options

  list: () ->
    $.alert "whole records list in projects section"
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: @parent.model.get 'records'

  details: (id) ->
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: @parent.model.get 'records'

  edit: (id) ->
    $.alert "projects edit #{id}"

  delete: (id) ->
    $.alert "projects delete #{id}"

  add: (id) ->
    $.alert "projects add #{id}"

  save: (id) ->
    $.alert "projects save #{id}"

(module?.exports = Tracktime.ProjectsRouter) or @Tracktime.ProjectsRouter = Tracktime.ProjectsRouter

class Tracktime.RecordsRouter extends Backbone.Router
  routes:
    '':             'list'
    ':id':         'details'
    ':id/edit':    'edit'
    ':id/delete':  'delete'
    ':id/add':     'add'
    ':id/save':    'save'

  initialize: (options) ->
    _.extend @, options

  list: () ->
    $.alert "records list"

  details: (id) ->
    $.alert "records detaids #{id}"

  edit: (id) ->
    $.alert "records edit #{id}"

  delete: (id) ->
    $.alert "records delete #{id}"

  add: (id) ->
    $.alert "records add #{id}"

  save: (id) ->
    $.alert "records save #{id}"

(module?.exports = Tracktime.RecordsRouter) or @Tracktime.RecordsRouter = Tracktime.RecordsRouter

class Tracktime.ReportsRouter extends Backbone.SubRoute
  routes:
    '':             'list'
    ':id':          'details'
    ':id/edit':     'edit'
    ':id/delete':   'delete'
    ':id/add':      'add'
    ':id/save':     'save'

  initialize: (options) ->
    _.extend @, options
    @parent.view.setSubView 'main', new Tracktime.ReportsView()

  list: () ->
    @parent.view.setSubView 'main', new Tracktime.ReportsView()

  details: (id) ->
    @parent.view.setSubView 'main', new Tracktime.ReportView()

  edit: (id) ->
    $.alert "reports edit #{id}"

  delete: (id) ->
    $.alert "reports delete #{id}"

  add: (id) ->
    $.alert "reports add #{id}"

  save: (id) ->
    $.alert "reports save #{id}"

(module?.exports = Tracktime.ReportsRouter) or @Tracktime.ReportsRouter = Tracktime.ReportsRouter

class Tracktime.UserRouter extends Backbone.SubRoute
  routes:
    '':       'details'
    'rates':  'rates'
    'logout': 'logout'


  initialize: (options) ->
    _.extend @, options
    # @parent.view.setSubView 'main', new Tracktime.UserView()

  details: () ->
    @parent.view.setSubView 'main', new Tracktime.UserView.Details()

  rates: () ->
    @parent.view.setSubView 'main', new Tracktime.UserView.Rates()

  logout: () ->
    $.alert "user logout process"



(module?.exports = Tracktime.UserRouter) or @Tracktime.UserRouter = Tracktime.UserRouter
