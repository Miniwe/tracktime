class Tracktime.ProjectsView extends Backbone.View
  container: '#main'
  template: JST['projecs/projecs']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Projects HERE - Only view'}

(module?.exports = Tracktime.ProjectsView) or @Tracktime.ProjectsView = Tracktime.ProjectsView

