process = process or window.process or {}


production =
  SERVER: 'https://ttpms.herokuapp.com'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'
test =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'
development =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'


switch window.process.env?.NODE_ENV
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
    title: "TrackTime App - from"

  initialize: () ->

    @populateActions()
    @set 'records', new Tracktime.RecordsCollection()

    @listenTo Tracktime.AppChannel, "isOnline", @updateApp

  updateApp: ->
    @get('records').fetch
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: () => @trigger 'render_records'

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

class Tracktime.Action extends Backbone.Model

  idAttribute: "_id"
  url: '/actions' #receive on activate actions for user (!)

  defaults:
    _id: null
    title: 'Default action title'
    formAction: '#'
    btnClass: 'btn-default'
    navbarClass: 'navbar-material-amber'
    icon:
      className: 'mdi-editor-mode-edit'
      letter: ''
    isActive: false
    isVisible: false
    inputValue: ''
    details: null # Tracktime.Action.Details or null

  validation: () ->
    # @todo make details validation

  attributes: () ->
    id: @model.cid

  constructor: (args...) ->
    super args...

  initialize: () ->
    @set 'details', new Tracktime.Action.Details()

  setActive: () ->
    @collection.setActive @

  processAction: (options) ->
    @set 'inputValue', options.subject
    @get('details').set(options) # @todo remove possible
    @newRecord() #@todo эта функция будет определятся в зависимости от типа action
    # @search() #@todo эта функция будет определятся в зависимости от типа action

  newRecord: () ->
    Tracktime.AppChannel.command 'newRecord', _.extend {project: 0}, @get('details').attributes

  search: () ->
    $.alert 'search under construction'

  successAdd: () ->
    @set 'inputValue', ''
    # @details.reset() # @todo on change details change view controls

(module?.exports = Tracktime.Action) or @Tracktime.Action = Tracktime.Action



# actions
#   options
#     details = view and model
#   onChangeDetails: function to apply details
#   save and restore selectedAction
# actinView:
#  when детали openicon is крестик
#   сохраняются данные деталей автоматически
#   крестик очищает и закрывает
#   при потере фокуса с деталей сохранненые автоматичеки выводятся рядом с subject





class Tracktime.Action.Details extends Backbone.Model


(module?.exports = Tracktime.Action.Details) or @Tracktime.Action.Details = Tracktime.Action.Details

class Lokitest
  constructor: () ->
    @test 'Start loki</li>'
    LokiJS = require('lokijs')
    @db = new LokiJS('users_1.json')

    $('.add-users').on 'click', (event) =>
      console.log 'add-users'
      event.preventDefault()
      @add()

    $('.get-users').on 'click', (event) =>
      console.log 'get-users'
      event.preventDefault()
      @get()

    return

  test : (msg) ->
    $('h1').html(msg) if msg
    return

  add : () ->
    users = @db.addCollection('users', indices: [ 'name' ])
    users.insert
      name: 'User 10'
      user: 20
    users.insert
      name: 'User 11'
      user: 21
    users.insert
      name: 'User 12'
      user: 22
    # console.log(users.data);
    @db.saveDatabase()
    return

  get : () ->
    @db.loadDatabase {}, =>
      users = @db.getCollection('users')
      # var records = users.data.length;
      if users
        console.log 'users', users.data
      else
        console.log 'no users Data'
        console.log 'will create'
        @add()
      return
    return

class Tracktime.Model extends Backbone.Model

  url: '/models'

  validation:
    field:
      required: true
    someAttribute: (value) ->
      return 'Error message' if value isnt 'somevalue'

  constructor: () ->
    return

  initialize: () ->
    return


(module?.exports = Tracktime.Model) or @Tracktime.Model = Tracktime.Model

class Tracktime.Record extends Backbone.Model
  idAttribute: "_id"
  urlRoot: config.SERVER + '/records'
  localStorage: new Backbone.LocalStorage (config.collection.records)

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
    # order: Tracktime.RecordsCollection.nextOrder()

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'


  initialize: (options, params, any) ->
    @listenTo @, 'change:subject', @updateLastAccess

  isValid: () ->
    # @todo add good validation
    true

  # parse: (response) ->
  #   response.lastAccess = (new Date(response.lastAccess)).getTime()
  #   response

  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()

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
        model.save {'isDeleted': true}, {ajaxSync: false}
        if options.ajaxSync
          _success = options.success
          _model = model
          options.success = (model, response) ->
            options.ajaxSync = !options.ajaxSync
            options.success = _success
            Backbone.sync method, _model, options

          Backbone.sync method, model, options
      else
        $.alert "unknown method #{method}"
        Backbone.sync method, model, options

(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record

class Tracktime.ActionsCollection extends Backbone.Collection
  model: Tracktime.Action
  url: '/actions'
  localStorage: new Backbone.LocalStorage ('records-backbone')
  active: null

  initialize: () ->
    # @router = new Tracktime.ActionsRouter {controller: @}
    # @setActive @models.findWhere isActive: true


  setActive: (active) ->
    @active?.set 'isActive', false
    active.set 'isActive', true
    @active = active

  getActive: () ->
    @active

  getVisible: () ->
    _.filter @models, (model) -> model.get('isVisible')

  fetch: () ->
    models = @localStorage.findAll()

    unless models.length
      _.each Tracktime.initdata.tmpActions, (action) ->
        newAction = new Tracktime.Action action
        newAction.save()
      models = @localStorage.findAll()

    @add models


(module?.exports = Tracktime.ActionsCollection) or @Tracktime.ActionsCollection = Tracktime.ActionsCollection

class Tracktime.RecordsCollection extends Backbone.Collection
  model: Tracktime.Record
  url: config?.SERVER + '/records'
  urlRoot: config?.SERVER + '/records'
  localStorage: new Backbone.LocalStorage (config.collection.records)

  initialize: () ->
    # @router = new Tracktime.RecordsRouter {controller: @}

  comparator: (model) -> - (new Date(model.get('date'))).getTime()

  addRecord: (params, options) ->
    newRecord = new Tracktime.Record params
    if newRecord.isValid()
      @add newRecord
      unless options.ajaxSync?
        options.ajaxSync = Tracktime.AppChannel.request 'isOnline'
      newRecord.save {}, options
    else
      $.alert 'Erros validation from add record to collection'

  fetch: (options) ->
    @resetLocalStorage()
    if options? and options.ajaxSync == true
      _success = options.success
      options.success = (collection, response, optionsSuccess) =>
        @syncRecords(response)
        _success.apply(@, collection, response, options) if _.isFunction(_success)
    super options

  syncRecords: (models) ->

    # по всем remote model которые вроде как в коллекции уже
    _.each models, (model) =>
      record = @get(model._id)
      localModel = @localStorage.find record
      # если нет локальной то сохраняем (локально)
      unless localModel
        record.save ajaxSync: false
      # иначе
      else
        # если локальная старее то обновляем с новых данных (локально)
        modelLastAccess = (new Date(model.lastAccess)).getTime()
        localLastAccess = (new Date(localModel.lastAccess)).getTime()
        if localModel.isDeleted
          # do nothing
          record.set {'isDeleted': true},  {trigger: false}
        else if localLastAccess < modelLastAccess
          record.save model, ajaxSync: false
        # иначе есть если локальная новее то
        else if localLastAccess > modelLastAccess
          # обновляем модель пришедшую в коллекции
          # сохраняем ее удаленно
          record.save localModel, ajaxSync: true

    # по всем local моделям
    localModels = @localStorage.findAll()
    _.each _.clone(localModels), (model) =>
      collectionModel = @get(model._id)
      # если удалена
      if model.isDeleted
        modelLastAccess = (new Date(model.lastAccess)).getTime()
        if collectionModel? and modelLastAccess > (new Date(collectionModel.get('lastAccess'))).getTime()
          destroedModel = collectionModel
        else
          destroedModel = new Tracktime.Record(model)
        # то удаляем локально и удаленно
        # и из коллекции если есть
        destroedModel.destroy ajaxSync: true
      else
        # если нет в коллекции
        unless collectionModel
          replacedModel = new Tracktime.Record {_id: model._id}
          replacedModel.fetch {ajaxSync: false}
          newModel = replacedModel.toJSON()
          delete newModel._id
          # то сохраняем ее удаленно
          # добавляем в коллекцию
          @addRecord newModel,
            success: (model, response) =>
              # заменяем на новосохраненную
              replacedModel.destroy {ajaxSync: false}


  resetLocalStorage: () ->
    @localStorage = new Backbone.LocalStorage (config.collection.records)



(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection

Tracktime.AppChannel = Backbone.Radio.channel 'app'

_.extend Tracktime.AppChannel,
  isOnline: null

  init: () ->
    @listenTo @, 'isOnline', (status) => @isOnline = status
    @checkOnline()
    @setWindowListeners()

    @model = new Tracktime()
    @bindComply()
    @bindRequest()
    return @


  checkOnline: () ->
    if window.navigator.onLine == true
      @checkServer()
    else
      @trigger 'isOnline', false

  checkServer: () ->
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

  setWindowListeners: () ->
    window.addEventListener "offline", (e) =>
      @trigger 'isOnline', false
    , false

    window.addEventListener "online", (e) =>
      @checkServer()
    , false

  bindComply: () ->
    @comply
      'start':           @startApp
      'newRecord':       @newRecord
      'serverOnline':    @serverOnline
      'serverOffline':   @serverOffline
      'checkOnline':     @checkOnline

  bindRequest: () ->
    @reply 'isOnline', () => @model.get('isOnline')

  startApp: () ->
    @view = new Tracktime.AppView {model: @model}
    @router = new Tracktime.AppRouter()
    Backbone.history.start
      pushState: false

  newRecord: (options) ->
    @model.addRecord(options)

  serverOnline: () ->
    @trigger 'isOnline', true

  serverOffline: () ->
    @trigger 'isOnline', false


(module?.exports = Tracktime.AppChannel) or @Tracktime.AppChannel = Tracktime.AppChannel

$ ->

  Tracktime.AppChannel.init().command 'start'

  return

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
  selector: 'class_v'
  labelFormatter: 'label_v'
  # attributes: 'inputNames' # returns the name attributes of bound view input elements
  # forceUpdate: true


_.extend Backbone.Model.prototype, Backbone.Validation.mixin
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
  nl2br = (text + '').replace /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2'
  return new Handlebars.SafeString nl2br

Handlebars.registerHelper 'dateFormat', (date) ->
  date

Handlebars.registerHelper 'minuteFormat', (val) ->
  currentHour = val / 720 * 12
  hour = Math.floor(currentHour)
  minute = Math.round((currentHour - hour) * 60)
  "#{hour}:#{minute}"

  # timestamp = Date.parse date
  # unless _.isNaN(timestamp)
  #   (new Date(timestamp)).toLocalString()
  # else
  #   new Date()


Tracktime.initdata = {}

Tracktime.initdata.tmpActions = [
  {
    title: 'Add record +4'
    formAction: '#'
    btnClass: 'btn-primary'
    navbarClass: 'navbar-material-amber'
    icon:
      className: 'mdi-editor-mode-edit'
      letter: ''
    isActive: true
    isVisible: true
  }
  {
    title: 'Search'
    formAction: '#'
    btnClass: 'btn-white'
    navbarClass: 'navbar-material-light-blue'
    icon:
      className: 'mdi-action-search'
      letter: ''
    isActive: false
    isVisible: true
    details: 'have any'
  }
  {
    title: 'Add record to project 1'
    formAction: '#'
    btnClass: 'btn-info'
    navbarClass: 'navbar-material-indogo'
    icon:
      className: 'letter'
      letter: 'P'
    isActive: false
    isVisible: true
    details: 'have any'
  }
  {
    title: 'Other wroject will be thouched'
    formAction: '#'
    btnClass: 'btn-info'
    navbarClass: 'navbar-material-indogo'
    icon:
      className: 'mdi-action-group-work'
      letter: ''
    isActive: false
    isVisible: true
  }
  {
    title: 'Add task to user'
    formAction: '#'
    btnClass: 'btn-warning'
    navbarClass: 'navbar-material-deep-purple'
    icon:
      className: 'mdi-social-person-outline'
      letter: ''
    isActive: false
    isVisible: true
  }
]

Tracktime.initdata.tmpRecords = [
  {
    description: 'Lorem'
    subject: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, culpa, deleniti, temporibus, itaque similique suscipit saepe rerum voluptates voluptatum asperiores modi possimus vitae inventore dolore illo incidunt dolorem animi iure provident labore minima delectus unde nihil soluta recusandae ut dicta explicabo perspiciatis dolores eum. Numquam molestias reiciendis quibusdam sunt suscipit fugit temporibus asperiores quia. Cum, vel, molestias, sapiente ex nisi blanditiis dolorem quod beatae obcaecati culpa eos eius at vitae sed modi explicabo tempore. Harum, error nam veritatis maiores est at incidunt quae magni amet non qui eum. Aperiam, harum, tenetur facere officia delectus omnis odio totam consequatur obcaecati tempora. '
    date: (new Date()).toISOString()

  }
  {
    description: 'Tempore'
    subject: 'Accusamus, cumque, aperiam velit quos quisquam ex officiis obcaecati totam ipsa saepe fugiat in. Corrupti, soluta, aliquid cumque adipisci nihil omnis explicabo itaque commodi neque dolorum fugit quibusdam deserunt voluptates corporis amet hic quod blanditiis nesciunt dignissimos vero iure. Omnis, provident ducimus delectus sed in incidunt expedita quae accusantium cum culpa recusandae rerum ipsum vitae aliquid ratione ea architecto optio accusamus similique saepe nobis vel deleniti tempora iure consequatur. Debitis laborum accusantium omnis iure velit necessitatibus quod veniam sequi! Excepturi, praesentium, porro ducimus fugit provident repellendus quibusdam dolorum nisi autem tenetur. Non, neque reiciendis eius sequi accusamus. Quam, nostrum, nesciunt. '
    date: (new Date()).toISOString()
  }
  {
    description: 'Consequuntur'
    subject: 'Obcaecati, incidunt, optio deleniti earum odio nobis dolore sapiente delectus. Accusamus sequi voluptatibus magni fuga fugit nisi aut nam rem repellat possimus! Delectus, harum nisi eos nostrum necessitatibus ducimus eius odio dolores ratione quas quos laboriosam magnam reprehenderit itaque nihil! Dolor, hic, asperiores alias aut voluptas odit illum voluptatem quod! Pariatur, nesciunt distinctio aliquam quam voluptatibus temporibus voluptate placeat quaerat nemo quidem. Asperiores, nihil quasi molestias suscipit sunt. Itaque, sapiente voluptatibus qui non fugit impedit voluptatem beatae repellat at nulla dignissimos esse doloribus. Officiis, dolorem, id, officia sapiente eius ullam vel dolorum numquam et aspernatur illo deleniti enim quam autem! '
    date: (new Date()).toISOString()

  }
  {
    description: 'Rem'
    subject: 'Quisquam ab soluta dicta amet possimus iure deserunt expedita facere maxime nemo. Laudantium, quod, dignissimos, quos perspiciatis illo numquam est hic qui totam eligendi aut in provident dolor. Libero, dolores, cumque ut molestiae iusto nostrum tempore voluptatum laborum iure quae? Culpa, et, deserunt, explicabo a assumenda voluptate commodi voluptatum possimus omnis totam libero ipsum delectus? Harum, facilis, suscipit perspiciatis dolorum sapiente quae voluptas assumenda cumque atque accusamus blanditiis ullam doloribus enim placeat saepe dolorem sed quos architecto error vero odit deserunt autem? Sunt, cumque, similique voluptatem quis voluptatum non explicabo quibusdam porro in nihil quae sint rem molestias vero beatae!'
    date: (new Date()).toISOString()
  }
]

(module?.exports = Tracktime.initdata) or @Tracktime.initdata = Tracktime.initdata

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
# class Tracktime.UI
#   instance = null

#   class PrivateUI
#     constructor: ->

#     run: ->
#       $.alert 'run'
#       $.material.init()

#   @get: () ->
#     instance ?= new PrivateUI()

# (module?.exports = Tracktime.UI) or @Tracktime.UI = Tracktime.UI

Tracktime.utils = {}

Tracktime.utils.nl2br = (text) ->
  (text + '').replace /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2'

(module?.exports = Tracktime.utils) or @Tracktime.utils = Tracktime.utils

class Tracktime.AdminRouter extends Backbone.SubRoute
  routes:
    'users':    'users'
    'projects': 'projects'
    'actions':  'actions'

  users: () ->
    $.alert "admin users"

  projects: () ->
    $.alert "admin projects"

  actions: () ->
    $.alert "admin actions"




(module?.exports = Tracktime.AdminRouter) or @Tracktime.AdminRouter = Tracktime.AdminRouter

class Tracktime.AppRouter extends Backbone.Router
  routes:
    '':                  'index'                #index
    'page1':             'page1'                #tmp page 1
    'page2':             'page2'                #tmp page 2
    'projects*subroute': 'invokeProjectsRouter' #Projects
    'reports*subroute':  'invokeReportsRouter'  #Reports
    'user*subroute':     'invokeUserRouter'     #User
    'admin*subroute':    'invokeAdminRouter'    #Admin
    '*actions':          'default'              #???

  initialize: (options) ->
    _.extend @, options

  invokeProjectsRouter: (subroute) ->
    unless @projectsRouter
      @projectsRouter = new Tracktime.ProjectsRouter "projects"

  invokeReportsRouter: (subroute) ->
    unless @reportsRouter
      @reportsRouter = new Tracktime.ReportsRouter "reports"

  invokeUserRouter: (subroute) ->
    unless @userRouter
      @userRouter = new Tracktime.UserRouter "user"

  invokeAdminRouter: (subroute) ->
    unless @adminRouter
      @adminRouter = new Tracktime.AdminRouter "admin"

  index: () ->
    $.alert 'index'

  page1: () ->
    $.alert 'Page 1'

  page2: () ->
    $.alert 'Page 2'

  default: (actions) ->
    $.alert 'Unknown page'
    @navigate "", true

(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter


class Tracktime.ProjectsRouter extends Backbone.SubRoute
  routes:
    '':             'list'
    ':id':          'details'
    ':id/edit':     'edit'
    ':id/delete':   'delete'
    ':id/add':      'add'
    ':id/save':     'save'

  list: () ->
    $.alert "projects list"

  details: (id) ->
    $.alert "projects details #{id}"

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
    '/:id':         'details'
    '/:id/edit':    'edit'
    '/:id/delete':  'delete'
    '/:id/add':     'add'
    '/:id/save':    'save'

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

  list: () ->
    $.alert "reports list"

  details: (id) ->
    $.alert "reports details #{id}"

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

  details: () ->
    $.alert "user details"

  rates: () ->
    $.alert "user rates"

  logout: () ->
    $.alert "user logout"




(module?.exports = Tracktime.UserRouter) or @Tracktime.UserRouter = Tracktime.UserRouter

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
  className: 'actions-group'
  template: JST['layout/header/actions']

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    @$el.html @template()
    dropdown = $('.select-action-type-dropdown', @$el)

    #add to select-action-type-dropdown in ul all - but selected mast be hidden
    ul = dropdown.find '.dropdown-menu'
    _.each @collection.getVisible(), (action) ->
      listBtn = new Tracktime.ActionView.ListBtn model: action, container: dropdown
      ul.append listBtn.$el
      $(listBtn.$el).click() if action.get 'isActive'


(module?.exports = Tracktime.ActionsView) or @Tracktime.ActionsView = Tracktime.ActionsView


class Tracktime.ActionView.ActiveBtn extends Backbone.View
  el: '#action_type'

  initialize: () ->
    @render()

  render: () ->
    @$el
      .attr 'class', "btn btn-fab #{@model.get('btnClass')} dropdown-toggle "
      .find('i').attr('class', @model.get('icon').className).html @model.get('icon').letter


(module?.exports = Tracktime.ActionView.ActiveBtn) or @Tracktime.ActionView.ActiveBtn = Tracktime.ActionView.ActiveBtn


class Tracktime.ActionView.DetailsBtn extends Backbone.View
  el: '#detailsNew'
  template: JST['blocks/action']

  initialize: () ->
    @$el.popover
      template: @template @model.toJSON()

  remove: () ->
    @$el.popover 'destroy'

(module?.exports = Tracktime.ActionView.DetailsBtn) or @Tracktime.ActionView.DetailsBtn = Tracktime.ActionView.DetailsBtn


class Tracktime.ActionView.ListBtn extends Backbone.View
  tagName: 'li'
  template: JST['layout/header/listbtn']
  events:
    'click': 'actionActive'

  initialize: (options) ->
    _.extend @, options
    @render()

    @listenTo @model, 'change:isActive', @updateHeader
    @listenTo @model, 'change:inputValue', @setInputVal

  render: () ->
    @$el.toggleClass('active', @model.get('isActive'))
    @$el.html @template @model.toJSON()

  actionActive: () ->
    @updateHeader()
    @model.setActive()

  updateHeader: () ->
    @$el.siblings().removeClass 'active'
    @$el.addClass 'active'

    #add to select-action-type-dropdown selected - can modify on action modell call
    @container.find("#action_type").replaceWith (new Tracktime.ActionView.ActiveBtn model: @model).$el

    #add selected detais if exist - will change from action modell call
    @container.parent().find("#detailsNew").popover('destroy')
    unless @model.get('details') is null
      @container.parent().find("#detailsNew").show().replaceWith (new Tracktime.ActionView.DetailsBtn model: @model).el
    else
      @container.parent().find("#detailsNew").hide()

    $('.floating-label', '#actions-form').html @model.get('title')

    @container.parents('.navbar').attr 'class', "navbar #{@model.get('navbarClass')} shadow-z-1"

    @setInputVal()

  setInputVal: () ->
    $('textarea', '#actions-form')?.val(@model.get('inputValue')).focus()


(module?.exports = Tracktime.ActionView.ListBtn) or @Tracktime.ActionView.ListBtn = Tracktime.ActionView.ListBtn


class Tracktime.AppView extends Backbone.View
  el: '#panel'
  className: ''
  layoutTemplate: JST['global/app']
  childViews: {}

  initialize: ->
    @render()
    @initUI()

  render: ->
    # $(document).title @model.get 'title'
    @$el.html @layoutTemplate @model.toJSON()
    @renderChilds()

  renderChilds: ->
    @childViews['header'] = new Tracktime.AppView.Header model: @model, container: @
    @childViews['main'] = new Tracktime.AppView.Main model: @model, container: @
    @childViews['footer'] = new Tracktime.AppView.Footer
      container: @
    @childViews['menu'] = new Tracktime.AppView.Menu
      model: @model,
      container: @

  initUI: ->
    $.material.init()
    slideout = new Slideout
      'panel': $('#panel')[0]
      'menu': $('#menu')[0]
      'padding': 256
      'tolerance': 70
    $("#menuToggler").on 'click', () -> slideout.toggle()


(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView


class Tracktime.AppView.Footer extends Backbone.View
  el: '#footer'
  template: JST['layout/footer']
  events:
    'click #click-me': 'clickMe'
    'click #window-close': 'windowClose'

  initialize: () ->
    @render()

  render: () ->
    @$el.html @template @model?.toJSON()

  clickMe: (event) ->
    event.preventDefault()
    $.alert 'Subview :: ' + $(event.target).attr 'href'

  windowClose: (event) ->
    event.preventDefault()
    $.alert 'Close window'
    window.close()


(module?.exports = Tracktime.AppView.Footer) or @Tracktime.AppView.Footer = Tracktime.AppView.Footer


class Tracktime.AppView.Header extends Backbone.View
  el: '#header'
  template: JST['layout/header']
  childViews: {}
  tmpDetails: {}

  initialize: (options) ->
    @options = options
    @render()
    @initUI()

  initUI: () ->
    $('[data-toggle="tooltip"]', @$el).tooltip()
    $('textarea', @el)
      .on('keydown', @fixEnter)
      .on('change, keyup', @checkContent)
      .textareaAutoSize()
    $('#send-form').on 'click', @sendForm

    @tmpDetails.recordDate = $(".select-date > .btn .caption ruby rt").html()
    $(".select-date .dropdown-menu").on 'click', '.btn', (event) =>
      event.preventDefault()
      $(".select-date > .btn .caption ruby").html $(event.currentTarget).find('ruby').html()
      @tmpDetails.recordDate = $(".select-date > .btn .caption ruby rt").html()
    $(".slider")
      .noUiSlider start: [1], range: {'min': [ 0 ], 'max': [ 720 ] }
      .on
        slide: (event, val) =>
          @tmpDetails.recordTime = val
          currentHour = val / 720 * 12
          hour = Math.floor(currentHour)
          minute = (currentHour - hour) * 60
          $('.slider .noUi-handle').attr 'data-before', hour
          $('.slider .noUi-handle').attr 'data-after', Math.round(minute)


  render: () ->
    @$el.html @template @model?.toJSON()
    @childViews['actions'] = new Tracktime.ActionsView
      collection: @model.get('actions')
      container: @

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        event.preventDefault()
        @tmpDetails.subject = $('textarea', @el).val()
        @actionSubmit()

  sendForm: (event) =>
    event.preventDefault()
    @tmpDetails.subject = $('textarea', @el).val()
    @actionSubmit()
    @checkContent()

  actionSubmit: (val) ->
    unless _.isEmpty @tmpDetails.subject
      $('textarea', @el).val('')
      @model.get('actions').getActive().processAction @tmpDetails

  checkContent: () =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".controls-container").toggleClass 'hidden', _.isEmpty $('textarea').val()
    , 500


(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header

class Tracktime.AppView.Main extends Backbone.View
  el: '#main'
  template: JST['layout/main']

  initialize: () ->
    @render()
    @bindEvents()

  render: () ->
    @$el.html @template @model?.toJSON()

  bindEvents: ->
    @listenTo @model, 'render_records', @renderRecords

  renderRecords: ->
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.html recordsView.el


(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main


class Tracktime.AppView.Menu extends Backbone.View
  el: '#menu'
  template: JST['layout/menu']
  events:
    'change #isOnline': 'updateOnlineStatus'

  initialize: () ->
    @render()
    @bindEvents()

  bindEvents: ->
    @listenTo Tracktime.AppChannel, "isOnline", (status) ->
      $('#isOnline').prop 'checked', status

  updateOnlineStatus: (event) ->
    if $(event.target).is(":checked")
      Tracktime.AppChannel.command 'checkOnline'
    else
      Tracktime.AppChannel.command "serverOffline"

  render: () ->
    @$el.html @template @model?.toJSON()


(module?.exports = Tracktime.AppView.Menu) or @Tracktime.AppView.Menu = Tracktime.AppView.Menu


class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'records-group-item shadow-z-1'
  template: JST['records/record']
  events:
    'click .btn.delete': "deleteRecord"
    'click .subject': "toggleEdit"


  initialize: () ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @change_isDeleted
    @listenTo @model, "change:subject", @change_subject

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html @template @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

  change_isDeleted: () ->
    @$el.remove() # @todo possible not need

  change_subject: () ->
    $('.subject', @$el).html Tracktime.utils.nl2br(@model.get 'subject')  # @todo add nl2br
    $('.subject_edit', @$el).val @model.get 'subject'

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        val = $(event.target).val()
        unless _.isEmpty val
          @model.set 'subject', val
          @saveRecord()
          @toggleEdit()
        event.preventDefault()

  toggleEdit: (event) ->
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'

  saveRecord: () ->
    @model.save {},
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'update record'
          timeout: 2000
          style: 'btn-info'

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
  tagName: 'ul'
  className: 'records-group'

  initialize: () ->
    @render()
    @listenTo @collection, "add remove", @updateRecordsList

  render: () ->
    _.each @collection.where(isDeleted: false), (record) =>
      recordView = new Tracktime.RecordView { model: record }
      @$el.append recordView.el
    , @

  updateRecordsList: (args...) ->
    @$el.html('')
    @render()


(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView

