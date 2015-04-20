class Tracktime.Element.ProjectDefinition extends Tracktime.Element
  className: 'project_definition'
  template: JST['elements/project_definition']
  defaultTitle: 'Select project'
  events:
    'click .btn-white': 'selectProject'

  initialize: (options = {}) ->
    _.extend @, options
    @render()
    @projects = Tracktime.AppChannel.request 'projects'
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    @projects.on 'sync', @renderProjectsList

  render: ->
    @$el.html @template
      title: @defaultTitle
    @renderProjectsList()

  renderProjectsList: =>
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    menu = $('.dropdown-menu', @$el)
    menu.children().remove()

    @updateTitle()
    for own key, value of @projectsList
      menu.append $("<li><a class='btn btn-white' data-project='#{key}' href='##{key}'>#{value}</a></li>")

    menu.append $("<li><a class='btn btn-white' data-project='0' href='#0'><span class='text-muted'>No project</span></a></li>")

  getTitle: ->
    project_id = @model.get @field
    if project_id of @projectsList
      "to " + @projectsList[project_id]
    else
      @defaultTitle

  selectProject: (event) =>
    event.preventDefault()
    project_id = $(event.currentTarget).data 'project'
    @model.set @field, project_id
    @updateTitle()
    @$el.parents('.form-control-wrapper').find('textarea').focus()

  updateTitle: ->
    $('.project_definition-toggler span.caption', @$el).text @getTitle()


(module?.exports = Tracktime.Element.ProjectDefinition) or @Tracktime.Element.ProjectDefinition = Tracktime.Element.ProjectDefinition

