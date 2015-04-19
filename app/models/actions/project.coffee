class Tracktime.Action.Project extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add project'
    projectModel: null
    formAction: '#'
    btnClass: 'btn-material-purple'
    btnClassEdit: 'btn-material-blue'
    navbarClass: 'navbar-inverse'
    icon:
      className: 'mdi-content-add-circle'
      classNameEdit: 'mdi-content-add-circle-outline'
      letter: ''
    isActive: null
    isVisible: true

  initialize: () ->
    @set 'projectModel', new Tracktime.Project() unless @get('projectModel') instanceof Tracktime.Project

  processAction: () ->
    projectModel = @get 'projectModel'
    if projectModel.isValid()
      if projectModel.isNew()
        Tracktime.AppChannel.command 'newProject', projectModel.toJSON()
        projectModel.clear().set(projectModel.defaults)
      else
        projectModel.save {},
          ajaxSync: Tracktime.AppChannel.request 'isOnline'
          success: () =>
            $.alert
              content: 'Project: update success'
              timeout: 2000
              style: 'btn-success'
            @destroy()

  destroy: (args...) ->
    @get('projectModel').isEdit = false
    @get('projectModel').trigger 'change:isEdit'
    super args...


(module?.exports = Tracktime.Action.Project) or @Tracktime.Action.Project = Tracktime.Action.Project
