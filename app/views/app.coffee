class Tracktime.AppView extends Backbone.View
  className: ''

  initialize: () ->
    @render()

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html('').append $("<h1>").html @model.get 'title'

  renderRecords: () ->
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.append recordsView.el

(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

