class Tracktime.Element.ProjectDefinition extends Tracktime.Element
  className: 'project_definition'
  template: JST['elements/project_definition']
  defaultTitle: 'Select project'
  events:
    'click .btn-white': 'selectProject'

  initialize: (options = {}) ->
    _.extend @, options
    @projects = Tracktime.AppChannel.request 'projects'
    @render()
    @projects.on 'sync', (project, models) => @renderProjectsList project.models


  render: ->
    @$el.html @template
      title: @getTitle()
    @renderProjectsList @projects.models

  renderProjectsList: (models) ->
    menu = $('.dropdown-menu', @$el)
    menu.children().remove()
    _.each models, (model) =>
      menu.append $("<li><a class='btn btn-white noDefault' data-project='#{model.get('_id')}' href='##{model.get('_id')}'>#{model.get('name')}</a></li>")

    menu.append $("<li><a class='btn btn-white' data-project='0' href='#0'><span class='text-muted'>No project</span></a></li>")

  getTitle: ->
    projectId = @model.get @field
    unless projectId == 0
      "to " + @projects.get(projectId).get 'name'
    else
      @defaultTitle

  selectProject: (event) =>
    event.preventDefault()
    @model.set @field, $(event.target).data 'project'
    @updateTitle()

  updateTitle: ->
    $('.project_definition-toggler span.caption', @$el).text @getTitle()
    @$el.parents('.form-control-wrapper').find('textarea').focus()


(module?.exports = Tracktime.Element.ProjectDefinition) or @Tracktime.Element.ProjectDefinition = Tracktime.Element.ProjectDefinition

