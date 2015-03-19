class Tracktime.RecordsRouter extends Backbone.Router
  routes:
    'records':            'list'
    'records/:id':         'details'
    'records/:id/edit':    'edit'
    'records/:id/delete':  'delete'
    'records/:id/add':     'add'
    'records/:id/save':    'save'

  initialize: (options) ->
    console.log 'init RecordsRouter'
    _.extend @, options

  list: () ->
    console.log 'list', @

  details: (id) ->
    console.log 'details', id

  edit: (id) ->
    console.log 'edit', id

  delete: (id) ->
    console.log 'delete', id

  add: (id) ->
    console.log 'add', id

  save: (id) ->
    console.log 'save', id


(module?.exports = Tracktime.RecordsRouter) or @Tracktime.RecordsRouter = Tracktime.RecordsRouter
