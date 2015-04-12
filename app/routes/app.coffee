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
    @view = new Tracktime.AppView model: @model

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
    @view.setView 'main', new Tracktime.AppView.Main model: @model, container: @view

  page2: () ->
    $.alert 'Page 2'
    @view.setView 'main', new Tracktime.AppView.Main2()
    @view.setView 'maintmp', new Tracktime.AppView.MainTmp()

  default: (actions) ->
    $.alert 'Unknown page'
    @navigate "", true

(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter

