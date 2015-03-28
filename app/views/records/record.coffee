class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'records-group-item'
  template: JST['records/record']

  initialize: () ->
    @render()

  attributes: () ->
    id: @model.cid

  render: () ->
    mjson = @model.toJSON()
    mjson.date = (new Date(parseInt(mjson.date,10))).toLocaleString()
    @$el.html @template mjson

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView

