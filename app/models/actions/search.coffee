class Tracktime.Action.Search extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Search'
    formAction: '#'
    btnClass: 'btn-white'
    navbarClass: 'navbar-material-light-blue'
    icon:
      className: 'mdi-action-search'
      letter: ''
    isActive: null
    isVisible: true

  initialize: (options = {}) ->
    @set options
    @set 'details', new Tracktime.Action.Details()

  processAction: (options) ->
    @get('details').set(options) # @todo remove possible
    @search()

  search: () ->
    $.alert 'search start'

(module?.exports = Tracktime.Action.Search) or @Tracktime.Action.Search = Tracktime.Action.Search