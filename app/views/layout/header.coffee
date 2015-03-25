class Tracktime.AppView.Header extends Backbone.View
  el: '#header'
  template: JST['layout/header']

  initialize: (options) ->
    @options = options
    @render()
    @initUI()

  initUI: () ->
    $('[data-toggle="tooltip"]', @el).tooltip()
    $('textarea', @el)
      .on('keydown', @fixEnter)
      .textareaAutoSize()
    $('.dropdown', @el).hover () ->
      $('.dropdown-toggle', @).trigger 'click'

  render: () ->
    @$el.html @template @model?.toJSON()

  fixEnter: (event) =>
    if event.keyCode == 13
      unless event.shiftKey
        $.alert 'will submit'
        event.preventDefault()

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
