class Tracktime.AppView.MainTmp extends Backbone.View
  template: JST['layout/main2']
  tagName: 'li'

  initialize: () ->
    console.log 'mainTMP', @
    @render()

  render: () ->
    @$el.html @template()


(module?.exports = Tracktime.AppView.Main) or @Tracktime.AppView.Main = Tracktime.AppView.Main

