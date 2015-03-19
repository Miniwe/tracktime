class Tracktime.AppRouter extends Backbone.Router
  routes:
    '':                            'index'        #index
    'populate':                    'pagepopulate' #populate
    'slashed/path':                'slashed'      #slashed/path
    'with-params/:param1/:param2': 'withParams'   #with-params/any/50
    # '*default':                    'default'      #???

  initialize: (options) ->
    _.extend @, options

  index: () ->
    console.log 'index'

  default: () ->
    console.log 'Unknown page'
    @navigate "", true

  pagepopulate: () ->
    @controller.populateRecords()

  slashed: () ->
    console.log 'slashed'

  withParams: (param1, param2) ->
    console.log 'withParams', param1, param2

(module?.exports = Tracktime.AppRouter) or @Tracktime.AppRouter = Tracktime.AppRouter
