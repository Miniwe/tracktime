class Tracktime.AppView.Header extends Backbone.View
  el: '#header'
  template: JST['layout/header']
  events:
    'click .select-action-type-dropdown li a': 'changeActionTypeTmp'

  initialize: (options) ->
    @options = options
    @render()
    @initUI()

  initUI: () ->
    $('[data-toggle="tooltip"]', @el).tooltip()
    $('textarea', @el)
      .on('keydown', @fixEnter)
      .on('change, keyup', @checkHeight)
      .textareaAutoSize()
    # $('.dropdown', @el).hover () ->
    #   $('.dropdown-toggle', @).trigger 'click'

  changeActionTypeTmp: (event) ->
    event.preventDefault()
    $('#action_type').html $(event.currentTarget).html()
    $('.floating-label').html $(event.currentTarget).data('original-title')
    $('textarea', @$el).focus()
    $('#action_type').removeClass()
    $('#action_type').addClass $(event.currentTarget).attr('class')
    $('.dropdown-menu li', @$el).removeClass('active')
    $(event.currentTarget).parent().addClass('active')

  render: () ->
    @$el.html @template @model?.toJSON()

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        unless _.isEmpty $(event.target).val()
          $.alert 'will submit - generate trigger with value'
        event.preventDefault()

  checkHeight: (event) =>
    diff = $('#actions-form').outerHeight(true) - $('.navbar').outerHeight(true)
    $('#actions-form').toggleClass "shadow-z-2", (diff > 10)

(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header


# actions
#   options
#     btn-class = btn-primary
#     color = classColor
#     href (target) = #search
#     title = Add record
#     icon mdi-editor-mode-edit
#     isActive
#     inputValue
#     isDetails
#     details = view and model
#   onChangeInput: function to run
#   onChangeDetails: function to apply details
#   save and restore selectedAction
# actinView:
#   changeAll for options
#     changeIcon
#     changeMenu state
#     ...
#  when детали open icon is крестик
#   сохраняются данные деталей автоматически
#   крестик очищает
#   при потере фокуса с деталей сохранненые автоматичеки выводятся рядом с subject
#  shift + Enter на форме отправляет ее на сохранение




