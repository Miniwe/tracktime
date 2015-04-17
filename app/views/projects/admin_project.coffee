class Tracktime.AdminView.ProjectView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['projects/admin_project']
  events:
    'click .btn.delete': "deleteProject"
    'click .subject': "toggleEdit"


  initialize: () ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:subject", @changeSubject

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html @template @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

  changeIsDeleted: () ->
    @$el.remove() # @todo possible not need

  changeSubject: () ->
    $('.subject', @$el).html (@model.get('subject') + '').nl2br()
    $('.subject_edit', @$el).val @model.get 'subject'

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        val = $(event.target).val()
        unless _.isEmpty val
          @model.set 'subject', val
          @saveProject()
          @toggleEdit()
        event.preventDefault()

  toggleEdit: (event) ->
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'

  saveProject: () ->
    @model.save {},
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'update project'
          timeout: 2000
          style: 'btn-info'

  deleteProject: (event) ->
    event.preventDefault()

    @model.destroy
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'delete project'
          timeout: 2000
          style: 'btn-danger'

(module?.exports = Tracktime.AdminView.ProjectView) or @Tracktime.AdminView.ProjectView = Tracktime.AdminView.ProjectView

