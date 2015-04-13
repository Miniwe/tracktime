class Tracktime.AdminView.Header extends Backbone.View
  container: '#header'
  template: JST['admin/layout/header']

  initialize: (options) ->
    @render()


  render: () ->
    $(@container).html @$el.html @template()

(module?.exports = Tracktime.AdminView.Header) or @Tracktime.AdminView.Header = Tracktime.AdminView.Header
