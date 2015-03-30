class Tracktime.Record extends Backbone.Model
  idAttribute: "_id"
  url: () -> @urlRoot('/records')
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
    # @url  = @collection.url
    # @set 'date', new Date(parseInt(options.date || (new Date()).getTime(), 10))

  isValid: () ->
    # @todo add good vliedation
    true

  # save: () ->
    # console.log 'save:', @, +@get('date')
    # @set 'date', +@get('date')
    # @
    # _.extend @attributes, {date: +@get('date')}

  # fetch: (params, options) ->
    # console.log 'fetch:', params, options
    # @set 'date', new Date parseInt @get('date'), 10

(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
