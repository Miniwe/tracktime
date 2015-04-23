class Tracktime.AdminView.UserView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item shadow-z-1'
  template: JST['users/admin_user']
  events:
    'click .btn.delete': "deleteUser"
    'click .subject': "toggleInlineEdit"
    'click .edit.btn': "editUser"


  initialize: ->
    unless @model.get 'isDeleted'
      @render()
    @listenTo @model, "change:isDeleted", @changeIsDeleted
    @listenTo @model, "change:first_name", @changeName
    @listenTo @model, "change:isEdit", @changeIsEdit
    @listenTo @model, "sync", @syncModel

  attributes: ->
    id: @model.cid

  render: ->
    data = _.extend {}, @model.toJSON(), hash: window.md5 @model.get('email').toLowerCase()
    @$el.html @template data
    $('.subject_edit', @$el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()

    textarea = new Tracktime.Element.Textarea
      model: @model
      className: 'subject_edit form-control hidden'
      field: 'first_name'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.on 'tSubmit', @sendForm

  changeIsEdit: ->
    @$el.toggleClass 'editmode', @model.isEdit == true

  syncModel: (model, options, params) ->
    model.isEdit = false
    model.trigger 'change:isEdit'
    model.trigger 'change:first_name'
    #todo update all elements after

  changeIsDeleted: ->
    @$el.remove() # @todo possible not need

  changeName: ->
    $('.subject', @$el).html (@model.get('first_name') + '').nl2br()
    $('.name_edit', @$el).val @model.get 'first_name'

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
          content: 'update user'
          timeout: 2000
          style: 'btn-info'

  editUser: ->
    $('.scrollWrapper').animate
      'scrollTop': @$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
    , 400, (event) =>
      @model.isEdit = true
      @model.trigger 'change:isEdit'

  deleteUser: (event) ->
    event.preventDefault()

    @model.destroy
      ajaxSync: Tracktime.AppChannel.request 'isOnline'
      success: (model, respond) ->
        $.alert
          content: 'delete user'
          timeout: 2000
          style: 'btn-danger'

(module?.exports = Tracktime.AdminView.UserView) or @Tracktime.AdminView.UserView = Tracktime.AdminView.UserView

