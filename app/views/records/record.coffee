class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['records/record']
  events:
    'click .btn.delete': "deleteRecord"
    'click .subject': "toggleInlineEdit"
    'click .edit.btn': "editRecord"


  initialize: ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:subject", @changeSubject
    @listenTo @model, "change:project", @changeProject
    @listenTo @model, "change:isEdit", @changeIsEdit
    @listenTo @model, "sync", @syncModel

    # @projects = Tracktime.AppChannel.request 'projects'
    # @projects.on 'sync', (projects, models) => @renderProjectInfo projects

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
      field: 'subject'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.on 'tSubmit', @sendForm

    # @renderProjectInfo()

  changeIsEdit: ->
    @$el.toggleClass 'editmode', @model.isEdit == true

  syncModel: (model, options, params) ->
    model.isEdit = false
    model.trigger 'change:isEdit'
    model.trigger 'change:subject'
    #todo update all elements after

  changeIsDeleted: ->
    @$el.remove() # @todo possible not need

  changeSubject: ->
    $('.subject', @$el).html (@model.get('subject') + '').nl2br()
    $('.subject_edit', @$el).val @model.get 'subject'

  changeProject: ->
    @renderProjectInfo()

  renderProjectInfo: (projects) ->
    console.log 'renderProjectInfo', project
    project_id = @model.get('project')
    project = projects.get project_id
    if project instanceof Tracktime.Project
      $(".record-info-project span", @$el).html "#{project.get('name')}"
    else
      $(".record-info-project span", @$el).addClass 'hidden'

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
          content: 'update record'
          timeout: 2000
          style: 'btn-info'

  editRecord: ->
    $('.scrollWrapper').animate
      'scrollTop': @$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
    , 400, (event) =>
      @model.isEdit = true
      @model.trigger 'change:isEdit'

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

