class Tracktime.AppView.Header extends Backbone.View
  el: '#header'
  template: JST['layout/header']
  childViews: {}

  initialize: (options) ->
    @options = options
    @render()
    @initUI()

  initUI: () ->
    $('[data-toggle="tooltip"]', @$el).tooltip()
    $('textarea', @el)
      .on('keydown', @fixEnter)
      .on('change, keyup', @checkHeight)
      .textareaAutoSize()

  render: () ->
    @$el.html @template @model?.toJSON()
    @childViews['actions'] = new Tracktime.ActionsView
      collection: @model.get('actions')
      container: @

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        unless _.isEmpty $(event.target).val()
          $.alert 'will submit - generate trigger with value'
        event.preventDefault()

  checkHeight: (event) =>
    diff = $('#actions-form').outerHeight(true) - $('.navbar').outerHeight(true)
    $('#actions-form').toggleClass "shadow-z-2", (diff > 10)

(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header
