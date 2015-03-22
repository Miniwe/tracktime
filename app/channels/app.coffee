AppChannel = Backbone.Radio.channel 'app'

_.extend AppChannel,
  init: () ->
    @model = new Tracktime()
    return @
  startApp: () ->
    @view = new Tracktime.AppView {model: @model}
    @router = new Tracktime.AppRouter()
    Backbone.history.start
      pushState: false

    $.alert 'start !'

AppChannel.comply 'start', AppChannel.startApp
AppChannel.comply 'populateRecords', () ->
  $.alert 'populateRecords !'
  @model.populateRecords()

(module?.exports = AppChannel) or @AppChannel = AppChannel
