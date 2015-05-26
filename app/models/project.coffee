class Tracktime.Project extends Tracktime.Model
  idAttribute: "_id"
  collectionName: config.collection.projects
  urlRoot: config.SERVER + '/' + 'projects'
  localStorage: new Backbone.LocalStorage 'projects'

  defaults:
    _id: null
    name: ''
    description: ''
    updatedAt: (new Date()).toISOString()
    isDeleted: false

  validation:
    name:
      required: true
      minLength: 4
      msg: 'Please enter a valid name'

  initialize: ->
    @isEdit = false
    @on 'change:name', @updateUpdatedAt
    @on 'change:isEdit', @changeIsEdit

  isValid: () ->
    # @todo add good validation
    true

  updateUpdatedAt: () ->
    @set 'updatedAt', (new Date()).toISOString()

  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit project', type: 'Project', canClose: true},
        title: 'Edit project: ' + @get('name').substr(0, 40)
        projectModel: @
        scope: 'edit:action'


(module?.exports = Tracktime.Project) or @Tracktime.Project = Tracktime.Project
