class Tracktime.RecordsView extends Backbone.View
  container: '#main'
  template: JST['records/records']
  tagName: 'ul'
  className: 'list-group'
  views: {}

  initialize: () ->
    @render()
    @listenTo @collection, "reset", @resetRecordsList
    @listenTo @collection, "add", @addRecord
    @listenTo @collection, "remove", @removeRecord

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Records'}
    @resetRecordsList()

  resetRecordsList: () ->
    _.each @collection.where(isDeleted: false), (record) =>
      recordView =  new Tracktime.RecordView { model: record }
      @$el.append recordView.el
      @setSubView "record-#{record.cid}", recordView
    , @

  addRecord: (record, collection, params) ->
    recordView = new Tracktime.RecordView { model: record }
    $(recordView.el).prependTo @$el
    @setSubView "record-#{record.cid}", recordView

  removeRecord: (record, args...) ->
    recordView = @getSubView "record-#{record.cid}"
    recordView.close() if recordView

(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView

