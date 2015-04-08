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
      'newRecord':       @newRecord
      'serverOnline':    @serverOnline

  bindRequest: () ->
    @reply 'isOnline', () => @model.get('isOnline')

  startApp: () ->
    @view = new Tracktime.AppView {model: @model}
    @router = new Tracktime.AppRouter()
    Backbone.history.start
      pushState: false

  newRecord: (options) ->
    console.log 'newRecord: options', options
    @model.addRecord(options)

  serverOnline: () ->
    @model.set 'isOnline', true


(module?.exports = Tracktime.AppChannel) or @Tracktime.AppChannel = Tracktime.AppChannel
