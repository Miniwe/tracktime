class Tracktime.UserRouter extends Backbone.SubRoute
  routes:
    '':       'details'
    'rates':  'rates'
    'logout': 'logout'


  initialize: (options) ->
    _.extend @, options
    # @parent.view.setSubView 'main', new Tracktime.UserView()

  details: () ->
    @parent.view.setSubView 'main', new Tracktime.UserView.Details()

  rates: () ->
    @parent.view.setSubView 'main', new Tracktime.UserView.Rates()

  logout: () ->
    @parent.model.get('authUser').logout()


(module?.exports = Tracktime.UserRouter) or @Tracktime.UserRouter = Tracktime.UserRouter
