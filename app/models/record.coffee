class Tracktime.Record extends Backbone.Model
  idAttribute: "_id"
  urlRoot: config.ROOT + '/records'
  localStorage: new Backbone.LocalStorage ('records-backbone')

  defaults:
    _id: null
    subject: ''
    description: ''
    date: () -> (new Date()).getTime()
    project: 0
    # order: Tracktime.RecordsCollection.nextOrder()

  validation:
    subject:
      required: true
      minLength: 4
      msg: 'Please enter a valid subject'


  initialize: (options, params, any) ->
    # @set 'date', new Date(parseInt(options.date || (new Date()).getTime(), 10))

  isValid: () ->
    # @todo add good validation
    true

(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
