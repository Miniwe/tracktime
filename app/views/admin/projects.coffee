class Tracktime.AdminView.ProjectsView extends Backbone.View
  container: '#main'
  template: JST['admin/projects']
  tagName: 'ul'
  className: 'list-group'
  views: {}

  initialize: () ->
    @render()
    @listenTo @collection, "reset", @resetProjectsList
    @listenTo @collection, "add", @addProject
    @listenTo @collection, "remove", @removeProject

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Projects'}
    @resetProjectsList()

  resetProjectsList: () ->
    _.each @collection.where(isDeleted: false), (project) =>
      projectView =  new Tracktime.AdminView.ProjectView { model: project }
      @$el.append projectView.el
      @setSubView "project-#{project.cid}", projectView
    , @

  addProject: (project, collection, params) ->
    projectView = new Tracktime.AdminView.ProjectView { model: project }
    $(projectView.el).prependTo @$el
    @setSubView "project-#{project.cid}", projectView

  removeProject: (project, args...) ->
    projectView = @getSubView "project-#{project.cid}"
    projectView.close() if projectView

(module?.exports = Tracktime.AdminView.ProjectsView) or @Tracktime.AdminView.ProjectsView = Tracktime.AdminView.ProjectsView

