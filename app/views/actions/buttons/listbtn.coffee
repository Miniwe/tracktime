class Tracktime.ActionView.ListBtn extends Backbone.View
  tagName: 'li'
  template: JST['actions/listbtn']
  events:
    'click': 'actionActive'

  initialize: (options) ->
    _.extend @, options
    @render()
    @listenTo @model, 'change:isActive', @updateActionControl

  render: () ->
    @$el.html @template @model.toJSON()
    @$el.toggleClass('active', @model.get('isActive'))
    @updateActionControl() if @model.get 'isActive'

  actionActive: (event) ->
    event.preventDefault()
    @model.setActive()

  updateActionControl: () ->
    @$el.siblings().removeClass 'active'
    @$el.addClass 'active'
    $("#action_type").replaceWith (new Tracktime.ActionView.ActiveBtn model: @model).$el


(module?.exports = Tracktime.ActionView.ListBtn) or @Tracktime.ActionView.ListBtn = Tracktime.ActionView.ListBtn

