class Tracktime.AppRouter extends Backbone.Router
  routes:
    '':                            'index'        #index
    'populate':                    'pagepopulate' #populate
    'slashed/path':                'slashed'      #slashed/path
    'with-params/:param1/:param2': 'withParams'   #with-params/any/50
    '*actions':                    'default'      #???

  initialize: (options) ->
    _.extend @, options

  index: () ->
    $.alert 'index'

  default: (actions) ->
    $.alert 'Unknown page'
    @navigate "", true

  pagepopulate: () ->
    Tracktime.AppChannel.command 'populateRecords'

  slashed: () ->
    $.alert
      content: 'slashed (4s)'
      timeout: 4000
    Tracktime.AppChannel.command 'altView'

  withParams: (param1, param2) ->
    $.alert 'withParams'

(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter
