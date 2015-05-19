class Tracktime.AppView.Menu extends Backbone.View
  container: '#menu'
  template: JST['layout/menu']
  searchStr: ''
  events:
    'change #isOnline': 'updateOnlineStatus'

  initialize: ->
    @render()
    @bindEvents()

    @projects = Tracktime.AppChannel.request 'projects'
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    @projects.on 'all', @renderMenuList

  bindEvents: ->
    @listenTo Tracktime.AppChannel, "isOnline", (status) ->
      $('#isOnline').prop 'checked', status
    @slideout = new Slideout
      'panel': $('#panel')[0]
      'menu': $('#menu')[0]
      'padding': 256
      'tolerance': 70
    $("#menuToggler").on 'click', => @slideout.toggle()
    $(".input-search", @container).on 'keyup', @setSearch

  setSearch: (event) =>
    @searchStr = $(event.currentTarget).val().toLowerCase()
    @searchProject()

  searchProject: (event) ->
    @renderSearchList()

  getSearchList: (limit = 5) ->
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

  renderMenuList: =>
    menu = $('#projects-section .list-style-group', @container)
    menu.children('.project-link').remove()

    limit = 5
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    keys = _.keys @projectsList
    if keys.length > 0
      keys = _.sortBy keys, (key) =>
       count = @projects.get(key).get('useCount')
       count = unless count == undefined then count else 0
       - count

      i = 0
      while i < limit
        project = @projects.get keys[i]
        menu.append $("<a class='list-group-item project-link' href='#records/project/#{project.id}'>#{project.get('name')}</a>").on 'click', 'a', @navTo
        i++

  renderSearchList: =>
    list = @getSearchList()
    menu = $('.menu-projects', @container)
    menu.children().remove()

    for own key, value of list
      menu.append $("<li><a href='#records/project/#{key}'>#{value}</a></li>").on 'click', 'a', @navTo

    if _.size(list) > 0
      if _.isEmpty(@searchStr)
        menu.dropdown().hide()
      else
        menu.dropdown().show()
    else
      menu.dropdown().hide()

  navTo: (event) ->
    href = $(event.currentTarget).attr('href')
    projectId = href.substr(-24)
    Tracktime.AppChannel.command 'useProject', projectId
    window.location.hash = href
    $('.menu-projects', @container).dropdown().hide()

  updateOnlineStatus: (event) ->
    if $(event.target).is(":checked")
      Tracktime.AppChannel.command 'checkOnline'
    else
      Tracktime.AppChannel.command 'serverOffline'

  render: ->
    $(@container).html @$el.html @template @model?.toJSON()
    _.each @model.get('projects').models, (model) =>
      projectLink = $('<a />', {class: 'list-group-item', href:"#projects/#{model.get('_id')}"}).html model.get('name')
      projectLink.appendTo "#projects-section .list-style-group"

  close: ->
    @slideout.close()
    super

(module?.exports = Tracktime.AppView.Menu) or @Tracktime.AppView.Menu = Tracktime.AppView.Menu

