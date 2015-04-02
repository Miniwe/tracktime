class Tracktime.AppView.Main extends Backbone.View
  el: '#main'
  template: JST['layout/main']

  initialize: () ->
    @render()
    @bindEvents()

  render: () ->
    @$el.html @template @model?.toJSON()

  bindEvents: ->
    @listenTo @model, 'render_records', @renderRecords

  renderRecords: ->
    @model.get('records').resetRecords()
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.html recordsView.el


(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main

