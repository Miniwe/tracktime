class Tracktime.AppView extends Backbone.View
  el: '#app-content'
  className: ''
  layoutTemplate: JST['global/app']
  # template: JST['dashboard']
  childViews: {}

  initialize: () ->
    @initChilds()
    @render()
    @bindEvents()

  initChilds: ()->
    @childViews['main'] = new Tracktime.AppView.Main
      parentView: @
      model: @model
    @childViews['footer'] = new Tracktime.AppView.Footer parentView: @

  bindEvents: () ->
    @listenTo @model, 'update_records', @renderRecords

  render: () ->
    # $(document).title @model.get 'title'
    @$el.html @layoutTemplate @model.toJSON()
    @renderChilds()

  renderChilds: ()->
    $.each @childViews, (index, subview) =>
      @$el.append subview.el

  renderRecords: () ->
    recordsView = new Tracktime.RecordsView {collection: @model.get('records')}
    @$el.append recordsView.el

(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

