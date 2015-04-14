class Tracktime.ActionView.DetailsBtn extends Backbone.View
  el: '#detailsNew'
  template: JST['actions/detailsbtn']

  initialize: () ->
    @$el.popover
      template: @template @model.toJSON()

  remove: () ->
    @$el.popover 'destroy'

(module?.exports = Tracktime.ActionView.DetailsBtn) or @Tracktime.ActionView.DetailsBtn = Tracktime.ActionView.DetailsBtn

