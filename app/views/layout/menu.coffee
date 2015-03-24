class Tracktime.AppView.Menu extends Backbone.View
  el: '#menu'
  template: JST['layout/menu']

  initialize: () ->
    @render()

  render: () ->
    @$el.html @template @model?.toJSON()


(module?.exports = Tracktime.AppView.Menu) or @Tracktime.AppView.Menu = Tracktime.AppView.Menu

