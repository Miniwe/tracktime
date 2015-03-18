class Tracktime.View extends Backbone.View
  tagName: 'div'
  className: 'class'
  id: 'view'

  initialize: () ->
    @render()

  render: () ->
     # @$el.html @model.get('field') + ' (' +  @model.get('someAttribute') + ')'
     @$el.html "#{@model.get('field')} (#{@model.get('someAttribute')})"

(module?.exports = Tracktime.View) or @Tracktime.View = Tracktime.View
