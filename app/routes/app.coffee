class Tracktime.AppRouter extends Backbone.Router
  routes:
    '':                            'index'        #index
    'projects*subroute':           'invokeProjectsRouter' #Projects
    'reports*subroute':            'invokeReportsRouter' #Reports
    'user*subroute':               'invokeUserRouter' #User
    'admin*subroute':              'invokeAdminRouter' #Admin
    '*actions':                    'default'      #???

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

  default: (actions) ->
    $.alert 'Unknown page'
    @navigate "", true

(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter

