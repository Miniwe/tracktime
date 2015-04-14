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
    @on 'route subroute', (route, params) =>
      @removeActionsExcept(route) unless route.substr(0,6) == 'invoke'
    @initAuthInterface()

  invokeProjectsRouter: (subroute) ->
    unless @projectsRouter
      @projectsRouter = new Tracktime.ProjectsRouter 'projects', parent: @

  invokeReportsRouter: (subroute) ->
    unless @reportsRouter
      @reportsRouter = new Tracktime.ReportsRouter 'reports', parent: @

  invokeUserRouter: (subroute) ->
    unless @userRouter
      @userRouter = new Tracktime.UserRouter 'user', parent: @

  invokeAdminRouter: (subroute) ->
    unless @adminRouter
      @adminRouter = new Tracktime.AdminRouter 'admin', parent: @

  initAuthInterface: () ->
    @view = new Tracktime.AppView model: @model
    @view.setSubView 'header', new Tracktime.AppView.Header model: @model
    @view.setSubView 'footer', new Tracktime.AppView.Footer()
    @view.setSubView 'menu', new Tracktime.AppView.Menu model: @model
    @view.initUI()

  index: () ->
    @navigate 'projects', trigger: true, replace: false

  default: (actions) ->
    $.alert 'Unknown page'
    @navigate '', true

  removeActionsExcept: (route) ->
    activeInScope = false
    _.each @model.get('actions').models, (action) ->
      if action.get('scope') and action.get('scope') isnt route
        activeInScope = true if action.get('isActive')
        action.destroy()

    @model.get('actions').at(0).setActive() if activeInScope

(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter

