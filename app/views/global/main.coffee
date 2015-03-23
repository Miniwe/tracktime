class Tracktime.AppView.Main extends Backbone.View
  template: JST['global/main']
  events:
    'click a': 'testLinks'

  initialize: () ->
    @render()

  render: () ->
    @$el.html @template @model?.toJSON()

  testLinks: (event) ->
    $.alert 'Clicked' + $(event.target).attr 'href'


(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main

