class Tracktime.Action.Project extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add project'
    inputValue: ''
    formAction: '#'
    btnClass: 'btn-danger'
    navbarClass: 'navbar-material-indigo'
    icon:
      className: 'mdi-editor-mode-edit'
      letter: ''
    isActive: null
    isVisible: true

  initialize: (options = {}) ->
    @set options
    @set 'details', new Tracktime.Action.Details()

  processAction: (options) ->
    @set 'inputValue', options.subject
    @get('details').set(options) # @todo remove possible
    @newProject()

  newProject: () ->
    Tracktime.AppChannel.command 'newProject', _.extend {project: 0}, @get('details').attributes

  successAdd: () ->
    @set 'inputValue', ''
    # @details.reset() # @todo on change details change view controls

(module?.exports = Tracktime.Action.Project) or @Tracktime.Action.Project = Tracktime.Action.Project
