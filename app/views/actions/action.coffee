class Tracktime.ActionView extends Backbone.View
  tagName: 'li'
  className: 'btn'
  events:
    'click a': 'setActive'

  initialize: () ->
    # _.bindAll @model, 'change:isActive', @update

  setActive: () ->
    @model.setActive()

(module?.exports = Tracktime.ActionView) or @Tracktime.ActionView = Tracktime.ActionView

