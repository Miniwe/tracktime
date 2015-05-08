class Tracktime.GuestRouter extends Backbone.Router
  routes:
    '':                  'index'                #index
    '*actions':          'default'              #???

  initialize: (options) ->
    _.extend @, options

    @initInterface()
    # @navigate '/', trigger: true, replace: false
    Backbone.history.loadUrl(Backbone.history.fragment);

  initInterface: () ->
    @view = new Tracktime.GuestView model: @model
    # @view.setSubView 'header', new Tracktime.GuestView.Header model: @model
    # @view.setSubView 'footer', new Tracktime.AppView.Footer()
    # @view.setSubView 'menu', new Tracktime.AppView.Menu model: @model
    @view.initUI()

  index: ->
    # $.alert 'Guest index page'

  default: (actions) ->
    # $.alert 'Unknown guest page'
    @navigate '', true


(module?.exports = Tracktime.GuestRouter) or @Tracktime.GuestRouter = Tracktime.GuestRouter

