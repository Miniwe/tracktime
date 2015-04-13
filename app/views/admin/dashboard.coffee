class Tracktime.AdminView.Dashboard extends Backbone.View
  container: '#main'
  template: JST['admin/dashboard']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template()

(module?.exports = Tracktime.AdminView.Dashboard) or @Tracktime.AdminView.Dashboard = Tracktime.AdminView.Dashboard

