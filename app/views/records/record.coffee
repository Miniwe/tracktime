class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'records-group-item'
  template: JST['records/record']

  initialize: () ->
    @render()

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html @template @model.toJSON()

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView

