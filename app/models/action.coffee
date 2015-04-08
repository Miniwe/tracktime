class Tracktime.Action extends Backbone.Model

  idAttribute: "_id"
  url: '/actions' #receive on activate actions for user (!)

  defaults:
    _id: null
    title: 'Default action title'
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

  attributes: () ->
    id: @model.cid

  constructor: (args...) ->
    super args...

  initialize: () ->
    @set 'details', new Tracktime.Action.Details()

  setActive: () ->
    @collection.setActive @

  processAction: (options) ->
    @set 'inputValue', options.subject
    @get('details').set(options) # @todo remove possible
    @newRecord() #@todo эта функция будет определятся в зависимости от типа action
    # @search() #@todo эта функция будет определятся в зависимости от типа action

  newRecord: () ->
    Tracktime.AppChannel.command 'newRecord', _.extend {project: 0}, @get('details').attributes

  search: () ->
    $.alert 'search under construction'

  successAdd: () ->
    @set 'inputValue', ''
    # @details.reset() # @todo on change details change view controls

(module?.exports = Tracktime.Action) or @Tracktime.Action = Tracktime.Action



# actions
#   options
#     details = view and model
#   onChangeDetails: function to apply details
#   save and restore selectedAction
# actinView:
#  when детали openicon is крестик
#   сохраняются данные деталей автоматически
#   крестик очищает и закрывает
#   при потере фокуса с деталей сохранненые автоматичеки выводятся рядом с subject




