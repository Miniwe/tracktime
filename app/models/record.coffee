class Tracktime.Record extends Backbone.Model

  urlRoot: '/records'

  defaults:
    _id: null
    subject: ''
    description: ''
    date: () -> new Date()
    project: 0
    # order: Tracktime.RecordsCollection.nextOrder()

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'


  initialize: () ->

  isValid: () ->
    # @todo add good vliedation
    true


(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
