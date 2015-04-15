class Tracktime.Action.Record extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add record'
    recordModel: null
    formAction: '#'
    btnClass: 'btn-primary'
    navbarClass: 'navbar-material-amber'
    icon:
      className: 'mdi-editor-mode-edit'
      letter: ''
    isActive: null
    isVisible: true

  initialize: (options = {}) ->
    @set options
    if options.model instanceof Tracktime.Record
      @set 'recordModel', new Tracktime.Record options.model.toJSON
    else
      @set 'recordModel', new Tracktime.Record()

  processAction: () ->
    recordModel = @get('recordModel')
    if recordModel.isValid()
      Tracktime.AppChannel.command 'newRecord', _.extend {project: 0}, recordModel.attributes
      recordModel.clear().set(recordModel.defaults)

  successAdd: () ->
    # @details.reset() # @todo on change details change view controls

(module?.exports = Tracktime.Action.Record) or @Tracktime.Action.Record = Tracktime.Action.Record
