class Tracktime.AppView.Footer extends Backbone.View
  el: '#footer'
  template: JST['layout/footer']
  events:
    'click #click-me': 'clickMe'
    'click #window-close': 'windowClose'

  initialize: () ->
    @render()

  render: () ->
    @$el.html @template @model?.toJSON()

  clickMe: (event) ->
    event.preventDefault()
    $.alert 'Subview :: ' + $(event.target).attr 'href'

  windowClose: (event) ->
    event.preventDefault()
    $.alert 'Close window'
    window.close()


(module?.exports = Tracktime.AppView.Footer) or @Tracktime.AppView.Footer = Tracktime.AppView.Footer

