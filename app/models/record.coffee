class Tracktime.Record extends Backbone.Model

  urlRoot: "/records"

  defaults:
    _id: null
    subject: ""
    description: ""
    date: () -> new Date()
    project: 0

  validation:
    subject: ->
      required: true
      msg: 'Please enter a valid subject'

  initialize: () ->


(module?.exports = Tracktime.Record) or @Tracktime.Record = Tracktime.Record
