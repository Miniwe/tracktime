class Tracktime.Action extends Backbone.Model

  urlRoot: '/actions' #receive on activate actions for user (!)

  defaults:
    _id: null
    title: 'Action title'
    formAction: '#'
    btnClass: 'btn-default'
    navbarClass: 'navbar-material-amber'
    icon:
      className: 'mdi-editor-mode-edit'
      letter: ''
    isActive: false
    isVisible: false
    inputValue: ''
    details: null # Tracktime.Action.Details or null

  validation: () ->
    # @todo make details validation

  initialize: () ->
    # @to

  setActive: () ->
    @collection.setActive @


(module?.exports = Tracktime.Action) or @Tracktime.Action = Tracktime.Action



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




