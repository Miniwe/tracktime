class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'records-group-item shadow-z-1'
  template: JST['records/record']
  events:
    'click .btn.delete': "deleteRecord"
    'click .subject': "toggleEdit"


  initialize: () ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @change_isDeleted
    @listenTo @model, "change:subject", @change_subject

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html @template @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

  change_isDeleted: () ->
    @$el.remove() # @todo possible not need

  change_subject: () ->
    $('.subject', @$el).html Tracktime.utils.nl2br(@model.get 'subject')  # @todo add nl2br
    $('.subject_edit', @$el).val @model.get 'subject'

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        val = $(event.target).val()
        unless _.isEmpty val
          # $(event.target).val('')
          @model.set 'subject', val
          @saveRecord()
          @toggleEdit()
        event.preventDefault()

  toggleEdit: (event) ->
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'

  saveRecord: () ->
    @model.save {},
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'update record'
          timeout: 2000
          style: 'btn-info'

  deleteRecord: (event) ->
    event.preventDefault()

    @model.destroy
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'delete record'
          timeout: 2000
          style: 'btn-danger'

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView

