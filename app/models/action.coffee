class Tracktime.Action extends Backbone.Model

  urlRoot: '/actions' #receive on activate actions for user (!)

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

  initialize: () ->
    # @to

  setActive: () ->
    @collection.setActive @

  processAction: (params) ->
    @set 'inputValue', params?.text
    @newRecord() #@todo эта функция будет определятся в зависимости от типа action
    # @search() #@todo эта функция будет определятся в зависимости от типа action

  newRecord: () ->
    Tracktime.AppChannel.command 'newRecord',
      subject: @get('inputValue')
      project: 0 # @todo @get('project')
      details: {} # @todo @get('details')

  search: () ->
    console.log 'call search'

  successAdd: () ->
    @set 'inputValue', ''

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




