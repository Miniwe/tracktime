class Tracktime.Action.Project extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add project'
    projectModel: null
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
    if options.projectModel instanceof Tracktime.Project
      @set 'projectModel', new Tracktime.Project options.projectModel.toJSON
    else
      @set 'projectModel', new Tracktime.Project()

  processAction: () ->
    projectModel = @get('projectModel')
    if projectModel.isValid()
      Tracktime.AppChannel.command 'newProject', _.extend {project: 0}, projectModel.toJSON()
      projectModel.clear().set(projectModel.defaults)

(module?.exports = Tracktime.Action.Project) or @Tracktime.Action.Project = Tracktime.Action.Project

