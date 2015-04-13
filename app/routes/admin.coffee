class Tracktime.AdminRouter extends Backbone.SubRoute
  routes:
    '':          'dashboard'
    'users':     'users'
    'projects':  'projects'
    'dashboard': 'dashboard'
    'actions':   'actions'

  initialize: (options) ->
    _.extend @, options
    # @parent.view.setSubView 'main', new Tracktime.AdminView()

  dashboard: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.Dashboard()

  users: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.Users()

  projects: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.Projects()

  actions: () ->
    @parent.view.setSubView 'main', new Tracktime.AdminView.Actions()




(module?.exports = Tracktime.AdminRouter) or @Tracktime.AdminRouter = Tracktime.AdminRouter
