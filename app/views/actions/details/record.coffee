class Tracktime.ActionView.Record extends Backbone.View
  container: '.form-control-wrapper'
  template: JST['actions/details/record']
  tmpDetails: {}
  views: {}

  initialize: (options) ->
    _.extend @, options
    @render()
    @initUI()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()

  initUI: () ->
    $('[data-toggle="tooltip"]', @$el).tooltip()

    $('textarea', @el)
      .on('keydown', @fixEnter)
      .on('change, keyup', @checkContent)
      .textareaAutoSize()
    $('#send-form').on 'click', @sendForm

    @tmpDetails.recordDate = $(".select-date > .btn .caption ruby rt").html()

    $(".select-date .dropdown-menu").on 'click', '.btn', (event) =>
      event.preventDefault()
      $(".select-date > .btn .caption ruby").html $(event.currentTarget).find('ruby').html()
      @tmpDetails.recordDate = $(".select-date > .btn .caption ruby rt").html()

    $(".slider")
      .noUiSlider
        start: [0]
        step: 5
        range: {'min': [ 0 ], 'max': [ 720 ] }
      .on
        slide: (event, val) =>
          @tmpDetails.recordTime = val
          currentHour = val / 720 * 12
          hour = Math.floor(currentHour)
          minute = (currentHour - hour) * 60
          $('.slider .noUi-handle').attr 'data-before', hour
          $('.slider .noUi-handle').attr 'data-after', Math.round(minute)
    $(".slider")
      .noUiSlider_pips
        mode: 'values'
        values: [0,60*1,60*2,60*3,60*4,60*5,60*6,60*7,60*8,60*9,60*10,60*11,60*12]
        density: 2
        format:
          to: (value) -> value / 60
          from: (value) -> value



  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        event.preventDefault()
        @tmpDetails.subject = $('textarea', @el).val()
        @actionSubmit()

  checkContent: () =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".controls-container").toggleClass 'hidden', _.isEmpty $('textarea').val()
    , 500

  sendForm: (event) =>
    event.preventDefault()
    @tmpDetails.subject = $('textarea', @el).val()
    @actionSubmit()
    @checkContent()

  actionSubmit: (val) ->
    unless _.isEmpty @tmpDetails.subject
      $('textarea', @el).val('')
      @model.processAction @tmpDetails

  # ============ ============ ============ ============ ============ ============
  #   #add selected detais if exist - will change from action modell call
  #   @container.parent().find("#detailsNew").popover('destroy')
  #   unless @model.get('details') is null
  #     @container.parent().find("#detailsNew").show().replaceWith (new Tracktime.ActionView.DetailsBtn model: @model).el
  #   else
  #     @container.parent().find("#detailsNew").hide()

  #   @setInputVal()

  # setInputVal: () ->
  #   $('textarea', '#actions-form')?.val(@model.get('inputValue')).focus()

(module?.exports = Tracktime.ActionView.Record) or @Tracktime.ActionView.Record = Tracktime.ActionView.Record

