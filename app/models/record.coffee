class Tracktime.Record extends Tracktime.Model
  idAttribute: "_id"
  urlRoot: config.SERVER + '/records'
  localStorage: new Backbone.LocalStorage (config.collection.records)


  defaults:
    _id: null
    subject: ''
    description: ''
    date: () -> (new Date()).toISOString()
    lastAccess: (new Date()).toISOString()
    recordDate: ''
    recordTime: 0
    project: 0
    isDeleted: false

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'

  initialize: (options, params, any) ->
    @isEdit = false
    @on 'change:subject change:recordTime change:recordDate change:project', @updateLastAccess
    @on 'change:isEdit', @changeIsEdit

  isValid: ->
    # @todo add good validation
    true

  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit record', type: 'Record'},
        title: 'Edit record: ' + @get('subject').substr(0, 40)
        navbarClass: 'navbar-material-indigo'
        btnClass: 'btn-material-indigo'
        icon:
          className: 'mdi-editor-mode-edit'
        recordModel: @
        scope: 'edit:action'


  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()


(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
