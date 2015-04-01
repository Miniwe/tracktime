class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'records-group-item shadow-z-1'
  template: JST['records/record']
  events:
    'click .btn.delete': "deleteRecord"


  initialize: () ->
    @render()

  attributes: () ->
    id: @model.cid

  render: () ->
    mjson = @model.toJSON()
    @$el.html @template mjson

  deleteRecord: (event) ->
    $.alert
      content: 'delete record'
      timeout: 4000
      style: 'btn-danger'

    event.preventDefault()
    # @model.set 'id', @model.id
    console.log 'stat', @model
    @model.destroy ajaxSync: Tracktime.AppChannel.request 'isOnline'

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView

