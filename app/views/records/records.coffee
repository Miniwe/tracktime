class Tracktime.RecordsView extends Backbone.View
  container: '#main'
  tagName: 'ul'
  className: 'records-group'

  initialize: () ->
    @render()
    @listenTo @collection, "reset", @resetRecordsList
    @listenTo @collection, "add remove", @updateRecordsList

  render: () ->
    $(@container).html @$el.html('')
    @resetRecordsList()

  resetRecordsList: (args...) ->
    _.each @collection.where(isDeleted: false), (record) =>
      recordView = new Tracktime.RecordView { model: record }
      @$el.append recordView.el
    , @

  updateRecordsList: (record, collection, params) ->
    if params.add
      recordView = new Tracktime.RecordView { model: record }
      @$el.prepend recordView.el

(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView

