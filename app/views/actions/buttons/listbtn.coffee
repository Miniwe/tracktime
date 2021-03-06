class Tracktime.ActionView.ListBtn extends Backbone.View
  tagName: 'li'
  template: JST['actions/listbtn']
  events:
    'click': 'actionActive'

  initialize: (options) ->
    _.extend @, options
    @render()
    @listenTo @model, 'change:isActive', @updateActionControl
    @listenTo @model, 'destroy', @close

  render: () ->
    model = @model.toJSON()
    if model.canClose
      model.btnClass = model.btnClassEdit
      model.icon.className = model.icon.classNameEdit
    @$el.html @template model
    if @model.get('isActive') == true
      @$el.addClass 'active'
      @updateActionControl()
    else
      @$el.removeClass 'active'

  actionActive: (event) ->
    event.preventDefault()
    @model.setActive()

  updateActionControl: () ->
    @$el.siblings().removeClass 'active'
    @$el.addClass 'active'
    $("#action_type").replaceWith (new Tracktime.ActionView.ActiveBtn model: @model).$el


(module?.exports = Tracktime.ActionView.ListBtn) or @Tracktime.ActionView.ListBtn = Tracktime.ActionView.ListBtn

