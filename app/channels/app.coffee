# https://github.com/marionettejs/backbone.radio
Tracktime.AppChannel = Backbone.Radio.channel 'app'

_.extend Tracktime.AppChannel,
  init: () ->
    @model = new Tracktime()
    @bindComply()
    @bindRequest()
    return @

  bindComply: () ->
    @comply
      'start':           @startApp
      'altView':         @altView
      'newRecord':       @newRecord

  bindRequest: () ->
    @reply 'isOnline', () => @model.get('isOnline')

  startApp: () ->
    @view = new Tracktime.AppView {model: @model}
    @router = new Tracktime.AppRouter()
    Backbone.history.start
      pushState: false
    @model.populateRecords()

  newRecord: (params) ->
    @model.addRecord(params)

  altView: () ->
    @model.set 'title', 'Mody App'
    @view2 = new Tracktime.AppView2 {model: @model}


(module?.exports = Tracktime.AppChannel) or @Tracktime.AppChannel = Tracktime.AppChannel
