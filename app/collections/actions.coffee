class Tracktime.ActionsCollection extends Backbone.Collection
  model: Tracktime.Action
  defaultActions: Tracktime.initdata.defaultActions
  url: '/actions'
  localStorage: new Backbone.LocalStorage ('records-backbone')
  active: null

  initialize: () ->
    _.each @defaultActions, (action) =>
      if (Tracktime.Action[action.type])
        actionModel = new Tracktime.Action[action.type](action)
        @push actionModel

  setActive: (active) ->
    @active?.set 'isActive', false
    active.set 'isActive', true
    @active = active

  getActive: () ->
    @active

  getVisible: () ->
    _.filter @models, (model) -> model.get('isVisible')

(module?.exports = Tracktime.ActionsCollection) or @Tracktime.ActionsCollection = Tracktime.ActionsCollection
