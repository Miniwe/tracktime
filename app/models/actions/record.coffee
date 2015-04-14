class Tracktime.Action.Record extends Tracktime.Action

  defaults: _.extend {}, Tracktime.Action.prototype.defaults,
    title: 'Add record'
    inputValue: ''
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
    @set 'details', new Tracktime.Action.Details()

  processAction: (options) ->
    @set 'inputValue', options.subject
    @get('details').set(options) # @todo remove possible
    @newRecord()

  newRecord: () ->
    Tracktime.AppChannel.command 'newRecord', _.extend {project: 0}, @get('details').attributes

  successAdd: () ->
    @set 'inputValue', ''
    # @details.reset() # @todo on change details change view controls

(module?.exports = Tracktime.Action.Record) or @Tracktime.Action.Record = Tracktime.Action.Record
