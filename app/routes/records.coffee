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
    $.alert "whole records list in records section"
    collection = @parent.model.get 'records'
    collection.resetFilter()
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: collection

  listFilter: (filter) ->
    $.alert "filtered list - yet disabled"
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
