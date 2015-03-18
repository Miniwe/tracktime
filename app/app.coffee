class Tracktime extends Backbone.Model

  initialize: () ->
    console.log 'Tracktime init'
    @set 'router', new Tracktime.Router()
    Backbone.history.start
      pushState: true

    return

(module?.exports = Tracktime) or @Tracktime = Tracktime
