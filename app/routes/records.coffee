class Tracktime.RecordsRouter extends Backbone.Router
  routes:
    'records':             'list'
    'records/:id':         'details'
    'records/:id/edit':    'edit'
    'records/:id/delete':  'delete'
    'records/:id/add':     'add'
    'records/:id/save':    'save'
    'records/all/clear':   'actions'

  initialize: (options) ->
    _.extend @, options

  list: () ->
    $.alert 'list'
    console.log 'list', @

  details: (id) ->
    $.alert 'details'
    console.log 'details', id

  edit: (id) ->
    $.alert 'edit'
    console.log 'edit', id

  delete: (id) ->
    $.alert 'delete'
    console.log 'delete', id

  add: (id) ->
    $.alert 'add'
    console.log 'add', id

  save: (id) ->
    $.alert 'save'
    console.log 'save', id

  allClear: () ->
    $.alert 'clear local storage @tmp'
    @controller.clearLocalstorage()

(module?.exports = Tracktime.RecordsRouter) or @Tracktime.RecordsRouter = Tracktime.RecordsRouter
