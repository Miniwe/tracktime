class Tracktime.ProjectsRouter extends Backbone.SubRoute
  routes:
    '':             'list'
    ':id':          'details'
    ':id/edit':     'edit'
    ':id/delete':   'delete'
    ':id/add':      'add'
    ':id/save':     'save'

  initialize: (options) ->
    _.extend @, options

  list: () ->
    $.alert "whole records list in projects section"
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: @parent.model.get 'records'

  details: (id) ->
    @parent.view.setSubView 'main', new Tracktime.RecordsView collection: @parent.model.get 'records'

  edit: (id) ->
    $.alert "projects edit #{id}"

  delete: (id) ->
    $.alert "projects delete #{id}"

  add: (id) ->
    $.alert "projects add #{id}"

  save: (id) ->
    $.alert "projects save #{id}"

(module?.exports = Tracktime.ProjectsRouter) or @Tracktime.ProjectsRouter = Tracktime.ProjectsRouter
