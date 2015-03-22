Tracktime.AppChannel = Backbone.Radio.channel 'app'

_.extend Tracktime.AppChannel,
  init: () ->
    @model = new Tracktime()
    @bindComply()
    return @

  bindComply: () ->
    @comply
      'start': @startApp
      'populateRecords': @populateRecords

  startApp: () ->
    @view = new Tracktime.AppView {model: @model}
    @router = new Tracktime.AppRouter()
    Backbone.history.start
      pushState: false

  populateRecords: () ->
    @model.populateRecords()


(module?.exports = Tracktime.AppChannel) or @Tracktime.AppChannel = Tracktime.AppChannel
