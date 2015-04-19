class Tracktime.ActionsCollection extends Backbone.Collection
  model: Tracktime.Action
  collectionName: config.collection.actions
  url: '/' + @collectionName
  localStorage: new Backbone.LocalStorage @collectionName
  defaultActions: [
    { title: 'Add Record', type: 'Record' }
    { title: 'Search', type: 'Search' }
  ]
  active: null

  initialize: ->
    @on 'remove', @setDefaultActive
    _.each @defaultActions, @addAction

  addAction: (action, params = {}) =>
    @push new Tracktime.Action[action.type] _.extend action, params if (Tracktime.Action[action.type])

  setDefaultActive: ->
    @at(0).setActive() unless @findWhere isActive: true

  setActive: (active) ->
    @active?.set 'isActive', false
    active.set 'isActive', true
    @active = active
    @trigger 'change:active', @active

  getActive: -> @active

  getActions: ->
    _.filter @models, (model) -> model.get('isVisible')

(module?.exports = Tracktime.ActionsCollection) or @Tracktime.ActionsCollection = Tracktime.ActionsCollection
