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
    @initInterface()
    @navigate 'projects', trigger: true, replace: false

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

  initInterface: () ->
    @view = new Tracktime.AppView model: @model
    @view.setSubView 'header', new Tracktime.AppView.Header model: @model
    @view.setSubView 'footer', new Tracktime.AppView.Footer()
    @view.setSubView 'menu', new Tracktime.AppView.Menu model: @model
    @view.initUI()

  index: ->
    # @navigate 'projects', trigger: true, replace: false

  default: (actions) ->
    $.alert 'Unknown page'
    @navigate '', true

  removeActionsExcept: (route) ->
    if @model.get('actions')
      _.each @model.get('actions').models, (action) ->
        action.destroy() if action && action.has('scope') and action.get('scope') isnt route


(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter

