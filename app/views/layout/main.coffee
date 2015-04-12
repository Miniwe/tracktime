class Tracktime.AppView.Main extends Backbone.View
  container: '#main'
  template: JST['layout/main']
  views: {}

  initialize: () ->
    @render()
    @bindEvents()

  render: () ->
    $(@container).html @$el.html @template @model?.toJSON()
    @renderRecords()

  bindEvents: ->
    @listenTo @model.get('records'), "reset", @renderRecords

  renderRecords: ->
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.html recordsView.el




(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main

