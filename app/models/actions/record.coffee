class Tracktime.Action.Record extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add record'
    recordModel: null
    formAction: '#'
    btnClass: 'btn-material-green'
    btnClassEdit: 'btn-material-lime'
    navbarClass: 'navbar-primary'
    icon:
      className: 'mdi-action-bookmark'
      classNameEdit: 'mdi-action-bookmark-outline'
      letter: ''
    isActive: null
    isVisible: true

  initialize: () ->
    @set 'recordModel', new Tracktime.Record() unless @get('recordModel') instanceof Tracktime.Record

  processAction: () ->
    recordModel = @get 'recordModel'
    if recordModel.isValid()
      if recordModel.isNew()
        Tracktime.AppChannel.command 'newRecord', recordModel.toJSON()
        recordModel.clear().set(recordModel.defaults)
      else
        recordModel.save {},
          ajaxSync: Tracktime.AppChannel.request 'isOnline'
          success: () =>
            $.alert
              content: 'Record: update success'
              timeout: 2000
              style: 'btn-success'
            @destroy()

  destroy: (args...) ->
    @get('recordModel').isEdit = false
    @get('recordModel').trigger 'change:isEdit'
    super args...


(module?.exports = Tracktime.Action.Record) or @Tracktime.Action.Record = Tracktime.Action.Record
