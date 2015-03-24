class Tracktime.AppView.Footer extends Backbone.View
  el: '#footer'
  template: JST['layout/footer']
  events:
    'click #click-me': 'clickMe'

  initialize: () ->
    @render()

  render: () ->
    @$el.html @template @model?.toJSON()

  clickMe: (event) ->
    event.preventDefault()
    $.alert 'Subview :: ' + $(event.target).attr 'href'


(module?.exports = Tracktime.AppView.Footer) or @Tracktime.AppView.Footer = Tracktime.AppView.Footer

