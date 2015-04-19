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
