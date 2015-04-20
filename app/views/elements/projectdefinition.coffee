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
    @projects.on 'sync', @renderProjectsList

  render: ->
    @$el.html @template
      title: @defaultTitle
    @renderProjectsList()

  renderProjectsList: =>
    console.log 'call renderProjectsList'
    @projects = Tracktime.AppChannel.request 'projects'
    console.log '@projects', @projects
    menu = $('.dropdown-menu', @$el)
    menu.children().remove()

    if @projects?
      @updateTitle()
      _.each @projects.models, (model) =>
        menu.append $("<li><a class='btn btn-white noDefault' data-project='#{model.get('_id')}' href='##{model.get('_id')}'>#{model.get('name')}</a></li>")

    menu.append $("<li><a class='btn btn-white' data-project='0' href='#0'><span class='text-muted'>No project</span></a></li>")

  getTitle: ->
    project_id = @model.get @field
    unless project_id == 0
      "to " + @projects.get(project_id).get 'name'
    else
      @defaultTitle

  selectProject: (event) =>
    event.preventDefault()
    @model.set @field, $(event.currentTarget).data 'project'
    @updateTitle()
    @$el.parents('.form-control-wrapper').find('textarea').focus()

  updateTitle: ->
    $('.project_definition-toggler span.caption', @$el).text @getTitle()


(module?.exports = Tracktime.Element.ProjectDefinition) or @Tracktime.Element.ProjectDefinition = Tracktime.Element.ProjectDefinition

