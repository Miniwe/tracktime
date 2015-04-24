class Tracktime.AppView.Header extends Backbone.View
  container: '#header'
  template: JST['layout/header']
  views: {}

  initialize: (options) ->
    console.log 'init header'
    @options = options
    @render()

  render: () ->
    $(@container).html @$el.html @template()
    console.log 'header @views before set', @views
    @setSubView 'actions', new Tracktime.ActionsView
      collection: @model.get('actions')

(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header
