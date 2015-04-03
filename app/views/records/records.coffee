class Tracktime.RecordsView extends Backbone.View
  tagName: 'ul'
  className: 'records-group'

  initialize: () ->
    @render()
    @listenTo @collection, "add remove", @updateRecordsList

  render: () ->
    _.each @collection.where(isDeleted: false), (record) =>
      recordView = new Tracktime.RecordView { model: record }
      @$el.append recordView.el
    , @

  updateRecordsList: (args...) ->
    @$el.html('')
    @render()


(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView

