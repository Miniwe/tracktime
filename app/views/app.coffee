class Tracktime.AppView extends Backbone.View
  el: '#app-content'
  className: ''
  # template: _.template $('#app-content').html()

  initialize: () ->
    @render()
    @bindEvents()

  bindEvents: () ->
    @listenTo @model, 'update_records', @renderRecords

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html('').append $("<h1>").html @model.get 'title'
    # renderedContent = @template @collection.toJSON()
    # $@el.html renderedContent)

  renderRecords: () ->
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.append recordsView.el

(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

