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
      .on('change, keyup', @checkContent)
      .textareaAutoSize()
    $('#send-form').on 'click', @sendForm
    $(".slider")
      .noUiSlider start: [1], range: {'min': [ 0 ], 'max': [ 1140 ] }
      .on
        slide: (event, val) ->
          hour = Math.floor(val/1140 * 12)
          # minute = Math.round(val/288 * 12 - hour)
          $('.slider .noUi-handle').attr 'data-before', hour
          # $('.slider .noUi-handle').attr 'data-after', '?m'


  render: () ->
    @$el.html @template @model?.toJSON()
    @childViews['actions'] = new Tracktime.ActionsView
      collection: @model.get('actions')
      container: @

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        event.preventDefault()
        val = $(event.target).val()
        @actionSubmit(val)
        $(event.target).val('')

  sendForm: (event) =>
    event.preventDefault()
    console.log 'call #send-form', $('textarea', @el).val()
    val = $('textarea', @el).val()
    @actionSubmit(val)
    $('textarea', @el).val('').trigger('change').blur()
    @checkContent(event)

  actionSubmit: (val) ->
    # console.log 'val', val
    unless _.isEmpty val
      @model.get('actions').getActive().processAction(text: val)

  checkContent: (event) =>
    diff = $('#actions-form').outerHeight(true) - $('.navbar').outerHeight(true)
    $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
    $(".controls-container").toggleClass 'hidden', _.isEmpty $('textarea').val()


(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header
