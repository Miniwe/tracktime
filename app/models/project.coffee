class Tracktime.Project extends Tracktime.Model
  idAttribute: "_id"
  collectionName: config.collection.projects
  urlRoot: config.SERVER + '/' + 'projects'
  localStorage: new Backbone.LocalStorage 'projects'

  defaults:
    _id: null
    name: ''
    description: ''
    lastAccess: (new Date()).toISOString()
    isDeleted: false

  validation:
    name:
      required: true
      minLength: 4
      msg: 'Please enter a valid name'


  initialize: ->
    @isEdit = false
    @on 'change:name', @updateLastAccess
    @on 'change:isEdit', @changeIsEdit

  isValid: () ->
    # @todo add good validation
    true

  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()

  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit project', type: 'Project', canClose: true},
        title: 'Edit project: ' + @get('name').substr(0, 40)
        navbarClass: 'navbar-material-purple'
        btnClass: 'btn-material-purple'
        icon:
          className: 'mdi-editor-mode-edit'
        projectModel: @
        scope: 'edit:action'


(module?.exports = Tracktime.Project) or @Tracktime.Project = Tracktime.Project
