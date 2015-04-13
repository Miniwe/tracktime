class Tracktime.ReportView extends Backbone.View
  container: '#main'
  template: JST['reports/report']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Report Details HERE'}

(module?.exports = Tracktime.ReportView) or @Tracktime.ReportView = Tracktime.ReportView

