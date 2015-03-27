class Tracktime.ActionView.ActiveBtn extends Backbone.View
  el: '#action_type'

  initialize: () ->
    @render()

  render: () ->
    @$el
      .attr 'class', "btn btn-fab #{@model.get('btnClass')} dropdown-toggle "
      .find('i').attr('class', @model.get('icon').className).html @model.get('icon').letter


(module?.exports = Tracktime.ActionView.ActiveBtn) or @Tracktime.ActionView.ActiveBtn = Tracktime.ActionView.ActiveBtn

