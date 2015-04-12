class Tracktime.AppView.Main extends Backbone.View
  container: '#main'
  template: JST['layout/main']

  initialize: () ->
    console.log 'main', @
    @render()
    @bindEvents()

  render: () ->
    $(@container).html @$el.html @template @model?.toJSON()

  bindEvents: ->
    @listenTo Tracktime.AppChannel, "isOnline", @renderRecords

  renderRecords: ->
    @model.get('records').fetch
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: =>
        recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
        @$el.html recordsView.el




(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main

