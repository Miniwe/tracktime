class Tracktime.AppView.Global extends Backbone.View
  el: 'body'
  template: JST['layout/global']

  initialize: () ->
    @render()

  render: () ->
    @$el.html @template @model?.toJSON()


(module?.exports = Tracktime.AppView.Global) or @Tracktime.AppView.Global = Tracktime.AppView.Global

