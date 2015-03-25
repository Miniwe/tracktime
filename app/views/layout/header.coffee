class Tracktime.AppView.Header extends Backbone.View
  el: '#header'
  template: JST['layout/header']
  events:
    'click #menuToggler': 'slideoutToggle'

  initialize: (options) ->
    @options = options
    @render()
    @initUI()

  initUI: () ->
    $('textarea', @el).textareaAutoSize();

  render: () ->
    @$el.html @template @model?.toJSON()

  slideoutToggle: ->
    @options.container.slideout.toggle()

(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header

