class Tracktime.AppView.Main2 extends Backbone.View
  container: '#main'
  template: JST['layout/main2']

  initialize: () ->
    console.log 'main2', @
    @render()

  render: () ->
    $(@container).html @$el.html @template()


(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main

