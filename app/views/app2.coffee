class Tracktime.AppView2 extends Backbone.View
  el: '#app-content'

  initialize: () ->
    @render()

  render: () ->
    @$el.html('').append $("<h1>").html "#{@model.get('title')} Alternative"


(module?.exports = Tracktime.AppView2) or @Tracktime.AppView2 = Tracktime.AppView2

