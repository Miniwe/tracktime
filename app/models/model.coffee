class Tracktime.Model extends Backbone.Model

  url: '/models'

  validation:
    field:
      required: true
    someAttribute: (value) ->
      return 'Error message' if value isnt 'somevalue'

  constructor: () ->
    return

  initialize: () ->
    return


(module?.exports = Tracktime.Model) or @Tracktime.Model = Tracktime.Model
