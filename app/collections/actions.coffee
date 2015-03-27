class Tracktime.ActionsCollection extends Backbone.Collection
  model: Tracktime.Action
  url: '/actions'
  localStorage: new Backbone.LocalStorage ('records-backbone')
  active: null

  initialize: () ->
    # @router = new Tracktime.ActionsRouter {controller: @}

  setActive: (active) ->
    @active?.set 'isActive', false
    active.set 'isActive', true
    @active = active

  getActive: () ->
    @active?

  getVisible: () ->
    _.filter @models, (model) -> model.get('isVisible')

(module?.exports = Tracktime.ActionsCollection) or @Tracktime.ActionsCollection = Tracktime.ActionsCollection
