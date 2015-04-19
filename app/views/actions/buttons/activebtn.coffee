class Tracktime.ActionView.ActiveBtn extends Backbone.View
  el: '#action_type'

  initialize: () ->
    @render()

  render: () ->
    model = @model.toJSON()
    if model.canClose
      model.btnClass = model.btnClassEdit
      model.icon.className = model.icon.classNameEdit
    @$el
      .attr 'class', "btn btn-fab #{model.btnClass} dropdown-toggle "
      .find('i').attr('class', model.icon.className).html model.icon.letter


(module?.exports = Tracktime.ActionView.ActiveBtn) or @Tracktime.ActionView.ActiveBtn = Tracktime.ActionView.ActiveBtn

