class Tracktime.RecordsRouter extends Backbone.Router
  routes:
    '':             'list'
    ':id':         'details'
    ':id/edit':    'edit'
    ':id/delete':  'delete'
    ':id/add':     'add'
    ':id/save':    'save'

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
