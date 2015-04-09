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
