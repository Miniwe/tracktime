class Tracktime.Element.ProjectDefinition extends Tracktime.Element
  className: 'project_definition'
  template: JST['elements/project_definition']
  defaultTitle: 'Select project'
  searchStr: ''
  events:
    'click .btn-white': 'selectProject'

  initialize: (options = {}) ->
    _.extend @, options
    @render()
    @projects = Tracktime.AppChannel.request 'projects'
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    @projects.on 'sync', @renderList

  render: ->
    @$el.html @template
      title: @defaultTitle
    @renderList()

    $('.input-cont', @$el)
      .on 'click', (event) -> event.stopPropagation()
    $('.input-cont input', @$el)
      .on 'keyup', @setSearch

  setSearch: (event) =>
    @searchStr = $(event.currentTarget).val().toLowerCase()
    @renderList()

  getList: (limit = 5) ->
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    keys = _.keys @projectsList
    unless _.isEmpty @searchStr
      keys = _.filter keys, (key) => @projectsList[key].toLowerCase().indexOf(@searchStr) > -1
    sublist = {}
    i = 0
    limit = Math.min(limit, keys.length)
    while i < limit
      sublist[ keys[i] ] = @projectsList[ keys[i] ]
      i++
    sublist

  renderList: =>
    list = @getList()
    menu = $('.dropdown-menu', @$el)
    menu.children('.item').remove()

    @updateTitle()

    for own key, value of list
      menu.append $("<li class='item'><a class='btn btn-white' data-project='#{key}' href='##{key}'>#{value}</a></li>")

    menu.append $("<li class='item'><a class='btn btn-white' data-project='0' href='#0'><span class='text-muted'>No project</span></a></li>")

  getTitle: ->
    projectId = @model.get @field
    if projectId of @projectsList
      "to " + @projectsList[projectId]
    else
      @defaultTitle

  selectProject: (event) =>
    event.preventDefault()
    projectId = $(event.currentTarget).data 'project'
    @model.set @field, projectId
    Tracktime.AppChannel.command 'useProject', projectId
    @updateTitle()
    @$el.parents('.form-control-wrapper').find('textarea').focus()

  updateTitle: ->
    $('.project_definition-toggler span.caption', @$el).text @getTitle()


(module?.exports = Tracktime.Element.ProjectDefinition) or @Tracktime.Element.ProjectDefinition = Tracktime.Element.ProjectDefinition

