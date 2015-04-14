class Tracktime.UserRouter extends Backbone.SubRoute
  routes:
    '':       'details'
    'rates':  'rates'
    'logout': 'logout'


  initialize: (options) ->
    _.extend @, options
    @on 'route', (route, params) =>
      @parent.trigger 'subroute', "user:#{route}", params
    # @parent.view.setSubView 'main', new Tracktime.UserView()

  details: () ->
    @parent.view.setSubView 'main', new Tracktime.UserView.Details()

  rates: () ->
    @parent.view.setSubView 'main', new Tracktime.UserView.Rates()

  logout: () ->
    $.alert "user logout process"



(module?.exports = Tracktime.UserRouter) or @Tracktime.UserRouter = Tracktime.UserRouter
