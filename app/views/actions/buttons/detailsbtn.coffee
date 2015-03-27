class Tracktime.ActionView.DetailsBtn extends Backbone.View
  el: '#detailsNew'
  events:
    'click': 'detailsShow'

  initialize: () ->

  detailsShow: () ->
    $.alert "Show details on #{@model.get('title')}"

(module?.exports = Tracktime.ActionView.DetailsBtn) or @Tracktime.ActionView.DetailsBtn = Tracktime.ActionView.DetailsBtn

