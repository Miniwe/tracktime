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
    $(".select-date .dropdown-menu .btn").on 'click', (event) ->
      event.preventDefault()
      $(".select-date > .btn .caption ruby").html $(@).find('ruby').html()
    $(".slider")
      .noUiSlider start: [1], range: {'min': [ 0 ], 'max': [ 720 ] }
      .on
        slide: (event, val) ->
          currentHour = val / 720 * 12
          hour = Math.floor(currentHour)
          minute = (currentHour - hour) * 60
          $('.slider .noUi-handle').attr 'data-before', hour
          $('.slider .noUi-handle').attr 'data-after', Math.round(minute)


  # 720 - 12
  # 456 - 7.6
  # 420   7 * 60
  #  36



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
    $('textarea', @el).val('') #.trigger('change').blur()
    @checkContent()

  actionSubmit: (val) ->
    # console.log 'val', val
    unless _.isEmpty val
      @model.get('actions').getActive().processAction(text: val)

  checkContent: () =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".controls-container").toggleClass 'hidden', _.isEmpty $('textarea').val()
    , 500


(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header
