# https://github.com/marionettejs/backbone.radio
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
      'altView': @altView

  startApp: () ->
    @view = new Tracktime.AppView {model: @model}
    @router = new Tracktime.AppRouter()
    Backbone.history.start
      pushState: false

  populateRecords: () ->
    @model.populateRecords()

  altView: () ->
    @model.set 'title', 'Mody App'
    @view2 = new Tracktime.AppView2 {model: @model}


(module?.exports = Tracktime.AppChannel) or @Tracktime.AppChannel = Tracktime.AppChannel
