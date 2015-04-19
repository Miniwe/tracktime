class Tracktime.Action.User extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add user'
    userModel: null
    formAction: '#'
    btnClass: 'btn-material-deep-orange'
    btnClassEdit: 'btn-material-amber'
    navbarClass: 'navbar-material-yellow'
    icon:
      className: 'mdi-social-person'
      classNameEdit: 'mdi-social-person-outline'
      letter: ''
    isActive: null
    isVisible: true

  initialize: () ->
    @set 'userModel', new Tracktime.User() unless @get('userModel') instanceof Tracktime.User

  processAction: () ->
    userModel = @get 'userModel'
    if userModel.isValid()
      if userModel.isNew()
        Tracktime.AppChannel.command 'newUser', userModel.toJSON()
        userModel.clear().set(userModel.defaults)
      else
        userModel.save {},
          ajaxSync: Tracktime.AppChannel.request 'isOnline'
          success: () =>
            $.alert
              content: 'User: update success'
              timeout: 2000
              style: 'btn-success'
            @destroy()

  destroy: (args...) ->
    @get('userModel').isEdit = false
    @get('userModel').trigger 'change:isEdit'
    super args...


(module?.exports = Tracktime.Action.User) or @Tracktime.Action.User = Tracktime.Action.User
