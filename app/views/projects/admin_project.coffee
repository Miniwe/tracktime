class Tracktime.AdminView.ProjectView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['projects/admin_project']
  events:
    'click .btn.delete': "deleteProject"
    'click .subject': "toggleInlineEdit"
    'click .edit.btn': "editProject"


  initialize: ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:name", @changeName
    @listenTo @model, "change:isEdit", @changeIsEdit
    @listenTo @model, "sync", @syncModel

  attributes: ->
    id: @model.cid

  render: ->
    @$el.html @template @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

    textarea = new Tracktime.Element.Textarea
      model: @model
      className: 'subject_edit form-control hidden'
      field: 'name'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.on 'tSubmit', @sendForm

  changeIsEdit: ->
    @$el.toggleClass 'editmode', @model.isEdit == true

  syncModel: (model, options, params) ->
    model.isEdit = false
    model.trigger 'change:isEdit'
    model.trigger 'change:name'
    #todo update all elements after

  changeIsDeleted: ->
    @$el.remove() # @todo possible not need

  changeName: ->
    $('.subject', @$el).html (@model.get('name') + '').nl2br()
    $('.name_edit', @$el).val @model.get 'name'

  toggleInlineEdit: ->
    @$el.find('.subject_edit').css 'min-height', @$el.find('.subject').height()
    @$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass 'hidden'
    @$el.find('.subject_edit').textareaAutoSize().focus()

  sendForm: =>
    @toggleInlineEdit()
    @model.save {},
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'update project'
          timeout: 2000
          style: 'btn-info'

  editProject: ->
    $('.scrollWrapper').animate
      'scrollTop': @$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
    , 400, (event) =>
      @model.isEdit = true
      @model.trigger 'change:isEdit'

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

