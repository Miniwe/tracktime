class Tracktime.RecordsRouter extends Backbone.Router
  routes:
    'records':             'list'
    'records/:id':         'details'
    'records/:id/edit':    'edit'
    'records/:id/delete':  'delete'
    'records/:id/add':     'add'
    'records/:id/save':    'save'

  initialize: (options) ->
    _.extend @, options

  list: () ->
    $.alert "records list"

  details: (id) ->
    $.alert "records detaids #{id}"

  edit: (id) ->
    $.alert "records edit #{id}"

  delete: (id) ->
    $.alert "records delete #{id}"

  add: (id) ->
    $.alert "records add #{id}"

  save: (id) ->
    $.alert "records save #{id}"

(module?.exports = Tracktime.RecordsRouter) or @Tracktime.RecordsRouter = Tracktime.RecordsRouter
