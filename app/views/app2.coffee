class Tracktime.AppView2 extends Backbone.View
  el: '#app-content'
  template: JST['header']

  initialize: () ->
    @render()

  render: () ->
    @$el.html('').append $("<h1>").html "#{@model.get('title')} Alternative"
    @$el.append @template
      text: 'Olala'
      obj:
        url: '#hello-world'
        body: 'Hello World'


(module?.exports = Tracktime.AppView2) or @Tracktime.AppView2 = Tracktime.AppView2

