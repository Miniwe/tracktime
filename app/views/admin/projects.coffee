class Tracktime.AdminView.Projects extends Backbone.View
  container: '#main'
  template: JST['admin/projects']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'Projects'}

(module?.exports = Tracktime.AdminView.Projects) or @Tracktime.AdminView.Projects = Tracktime.AdminView.Projects

