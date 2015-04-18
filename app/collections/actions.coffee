class Tracktime.ActionsCollection extends Backbone.Collection
  model: Tracktime.Action
  collectionName: config.collection.actions
  url: '/' + 'actions'
  localStorage: new Backbone.LocalStorage 'actions'
  defaultActions: [
    { title: 'Add Record', type: 'Record' }
    { title: 'Search', type: 'Search' }
  ]
  active: null

  initialize: ->
    @on 'remove', @setDefaultActive
    _.each @defaultActions, @addAction

  addAction: (action, params = {}) =>
    if (Tracktime.Action[action.type])
      actionModel = new Tracktime.Action[action.type] action
      actionModel.set params
      @push actionModel
      return actionModel

  setDefaultActive: ->
    @at(0).setActive() unless @find isActive: true

  setActive: (active) ->
    @active?.set 'isActive', false
    active.set 'isActive', true
    @active = active
    @trigger 'change:active', @active

  getActive: -> @active

  getActions: ->
    _.filter @models, (model) -> model.get('isVisible')

(module?.exports = Tracktime.ActionsCollection) or @Tracktime.ActionsCollection = Tracktime.ActionsCollection
