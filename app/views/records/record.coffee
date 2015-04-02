class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'records-group-item shadow-z-1'
  template: JST['records/record']
  events:
    'click .btn.delete': "deleteRecord"


  initialize: () ->
    unless @model.get 'isDeleted'
      @$el.parent().remove()
      @render()
    @listenTo @model, "change:isDeleted", @change_isDeleted

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html @template @model.toJSON()

  change_isDeleted: () ->
    @$el.remove() # @todo possible not need
    @remove() if @model.get 'isDeleted'

  deleteRecord: (event) ->
    event.preventDefault()
    $.alert
      content: 'delete record'
      timeout: 4000
      style: 'btn-danger'

    @model.destroy ajaxSync: Tracktime.AppChannel.request 'isOnline'

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView

