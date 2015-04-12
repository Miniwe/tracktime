class Tracktime.RecordsView extends Backbone.View
  container: '#main'
  tagName: 'ul'
  className: 'records-group'

  initialize: () ->
    @render()
    @listenTo @collection, "reset", @resetRecordsList
    @listenTo @collection, "add remove", @updaeRecordsList

  render: () ->
    $(@container).html @$el.html('')
    @resetRecordsList()

  resetRecordsList: (args...) ->
    console.log 'updateRecordsList', @collection
    _.each @collection.where(isDeleted: false), (record) =>
      recordView = new Tracktime.RecordView { model: record }
      @$el.append recordView.el
    , @

  updateRecordsList: (args...) ->
    console.log 'call update', args...

(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView

