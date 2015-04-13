class Tracktime.ReportsView extends Backbone.View
  container: '#main'
  template: JST['reports/reports']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Reports HERE'}

(module?.exports = Tracktime.ReportsView) or @Tracktime.ReportsView = Tracktime.ReportsView

