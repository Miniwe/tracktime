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
      .on('change, keyup', @checkHeight)
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
          @toggleEdit()
        event.preventDefault()

  checkHeight: (event) =>
    # diff = $('#actions-form').outerHeight(true) - $('.navbar').outerHeight(true)
    # $('#actions-form').toggleClass "shadow-z-2", (diff > 10)

  toggleEdit: (event) ->
    $.alert 'click'
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'

  deleteRecord: (event) ->
    event.preventDefault()
    $.alert
      content: 'delete record'
      timeout: 4000
      style: 'btn-danger'

    @model.destroy ajaxSync: Tracktime.AppChannel.request 'isOnline'

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView

