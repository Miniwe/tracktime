class Tracktime.Project extends Tracktime.Model
  idAttribute: "_id"
  urlRoot: config.SERVER + '/projects'
  localStorage: new Backbone.LocalStorage (config.collection.projects)

  defaults:
    _id: null
    name: ''
    description: ''
    lastAccess: (new Date()).toISOString()
    isDeleted: false
    # order: Tracktime.ProjectsCollection.nextOrder()

  validation:
    name:
      required: true
      minLength: 4
      msg: 'Please enter a valid name'


  initialize: (options, params, any) ->
    @listenTo @, 'change:name', @updateLastAccess

  isValid: () ->
    # @todo add good validation
    true
  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()


(module?.exports = Tracktime.Project) or @Tracktime.Project = Tracktime.Project
