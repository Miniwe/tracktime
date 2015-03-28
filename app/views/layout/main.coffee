class Tracktime.AppView.Main extends Backbone.View
  el: '#main'
  template: JST['layout/main']
  events:
    'click a': 'testLinks'

  initialize: () ->
    @render()
    @bindEvents()

  render: () ->
    @$el.html @template @model?.toJSON()

  testLinks: (event) ->
    $.alert 'Clicked' + $(event.target).attr 'href'

  bindEvents: ->
    @listenTo @model, 'render_records', @renderRecords

  renderRecords: ->
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.html recordsView.el


(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main

