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
    # order: Tracktime.RecordsCollection.nextOrder()

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'


  initialize: (options, params, any) ->
    @listenTo @, 'change:subject', @updateLastAccess

  isValid: () ->
    # @todo add good validation
    true
  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()


(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
