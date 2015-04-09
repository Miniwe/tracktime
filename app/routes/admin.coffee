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
