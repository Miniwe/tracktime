class Tracktime.ProjectsRouter extends Backbone.SubRoute
  routes:
    '':             'list'
    ':id':          'details'
    ':id/edit':     'edit'
    ':id/delete':   'delete'
    ':id/add':      'add'
    ':id/save':     'save'

  list: () ->
    $.alert "projects list"

  details: (id) ->
    $.alert "projects details #{id}"

  edit: (id) ->
    $.alert "projects edit #{id}"

  delete: (id) ->
    $.alert "projects delete #{id}"

  add: (id) ->
    $.alert "projects add #{id}"

  save: (id) ->
    $.alert "projects save #{id}"

(module?.exports = Tracktime.ProjectsRouter) or @Tracktime.ProjectsRouter = Tracktime.ProjectsRouter
