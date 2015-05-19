class Tracktime.RecordsRouter extends Backbone.SubRoute
  routes:
    '':             'list'
    '*filter':      'listFilter'
    ':id':          'details'
    ':id/edit':     'edit'
    ':id/delete':   'delete'
    ':id/add':      'add'
    ':id/save':     'save'

  initialize: (options) ->
    _.extend @, options

  list: () ->
    collection = @parent.model.get 'records'
    collection.resetFilter()
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: collection

  listFilter: (filter) ->
    collection = @parent.model.get 'records'
    collection.setFilter filter
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: collection

  details: (id) ->
    $.alert "details"
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: @parent.model.get 'records'

  edit: (id) ->
    $.alert "records edit #{id}"

  delete: (id) ->
    $.alert "records delete #{id}"

  add: (id) ->
    $.alert "records add #{id}"

  save: (id) ->
    $.alert "records save #{id}"

(module?.exports = Tracktime.RecordsRouter) or @Tracktime.RecordsRouter = Tracktime.RecordsRouter
