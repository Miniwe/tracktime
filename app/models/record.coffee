class Tracktime.Record extends Tracktime.Model
  idAttribute: "_id"
  collectionName: config.collection.records
  urlRoot: config.SERVER + '/' + 'records'
  localStorage: new Backbone.LocalStorage 'records'

  defaults:
    _id: null
    subject: ''
    description: ''
    date: () -> (new Date()).toISOString()
    updatedAt: (new Date()).toISOString()
    recordDate: ''
    recordTime: 0
    project: 0
    user: 0
    isDeleted: false

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'

  initialize: ->
    @isEdit = false
    @on 'change:subject change:recordTime change:recordDate change:project', @updateUpdatedAt
    @on 'change:isEdit', @changeIsEdit

  isValid: ->
    # @todo add good validation
    true

  isSatisfied: (filter) ->
    _.isMatch @attributes, filter

  updateUpdatedAt: () ->
    @set 'updatedAt', (new Date()).toISOString()

  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit record', type: 'Record', canClose: true},
        title: 'Edit record: ' + @get('subject').substr(0, 40)
        recordModel: @
        scope: 'edit:action'

  setActive: ->
    @collection.trigger 'activeRecord', @id


(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
