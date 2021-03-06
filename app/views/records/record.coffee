class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['records/record']
  events:
    'click .btn.delete': "deleteRecord"
    'click .subject': "toggleInlineEdit"
    'click .edit.btn': "editRecord"
    'click .btn[role=do-active]': "toggleActive"


  initialize: ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:subject", @changeSubject
    @listenTo @model, "change:project", @changeProject
    @listenTo @model, "change:recordTime", @changeRecordTime
    @listenTo @model, "change:isEdit", @changeIsEdit
    @listenTo @model, "sync", @syncModel
    @listenTo @model, "isActive", @setActiveState


    @projects = Tracktime.AppChannel.request 'projects'
    @projects.on 'sync', @renderProjectInfo

    @users = Tracktime.AppChannel.request 'users'
    @users.on 'sync', @renderUserInfo

  attributes: ->
    id: @model.cid

  render: ->
    @$el.html @template _.extend {filter: @model.collection.getFilter()}, @model.toJSON()
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

    textarea = new Tracktime.Element.Textarea
      model: @model
      className: 'subject_edit form-control hidden'
      field: 'subject'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.on 'tSubmit', @sendForm

    @$el.addClass 'current' if Tracktime.AppChannel.checkActive @model.id
    @changeRecordTime()

    @renderProjectInfo()
    @renderUserInfo()

  toggleActive: ->
    Tracktime.AppChannel.command 'activeRecord', @model, not(Tracktime.AppChannel.checkActive @model.id)

  setActiveState: (status) ->
    console.log 'try set acgive state', status, @$el
    $('.list-group-item').removeClass 'current'
    @$el.toggleClass 'current', status


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

  changeRecordTime: ->
    duration = moment.duration(parseInt(@model.get('recordTime'), 10),'minute')
    durationStr = duration.get('hours') + ':' + duration.get('minutes')
    $('.recordTime .value', @$el).html durationStr

  changeProject: ->
    @renderProjectInfo()

  renderProjectInfo: =>
    project_id = @model.get('project')
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    if project_id of @projectsList
      title = @projectsList[project_id]
      $(".record-info-project span", @$el).html title
      $(".record-info-project", @$el).removeClass 'hidden'
      $(".btn.type i", @$el).removeClass().addClass('letter').html title.letter()
    else
      $(".record-info-project", @$el).addClass 'hidden'
      $(".btn.type i", @$el).removeClass().addClass('mdi-action-bookmark-outline').html ''

  renderUserInfo: =>
    user_id = @model.get('user')
    @usersList = Tracktime.AppChannel.request 'usersList'
    if user_id of @usersList
      title = @usersList[user_id]
      $(".record-info-user span", @$el).html title
      $(".record-info-user", @$el).removeClass 'hidden'
    else
      $(".record-info-user", @$el).addClass 'hidden'

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

