class Tracktime.ProjectView extends Backbone.View
  container: '#main'
  template: JST['projects/project']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Project Details HERE'}

(module?.exports = Tracktime.ProjectView) or @Tracktime.ProjectView = Tracktime.ProjectView

