class Tracktime.AdminView.Actions extends Backbone.View
  container: '#main'
  template: JST['admin/actions']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Actions'}

(module?.exports = Tracktime.AdminView.Actions) or @Tracktime.AdminView.Actions = Tracktime.AdminView.Actions

