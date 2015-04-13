class Tracktime.AppView.Header extends Backbone.View
  container: '#header'
  template: JST['layout/header']
  views: {}
  tmpDetails: {}

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


  render: () ->
    $(@container).html @$el.html @template @model?.toJSON()
    @views['actions'] = new Tracktime.ActionsView
      collection: @model.get('actions')

  fixEnter: (event) =>
    if event.keyCode == 13
      if event.shiftKey
        event.preventDefault()
        @tmpDetails.subject = $('textarea', @el).val()
        @actionSubmit()

  sendForm: (event) =>
    event.preventDefault()
    @tmpDetails.subject = $('textarea', @el).val()
    @actionSubmit()
    @checkContent()

  actionSubmit: (val) ->
    unless _.isEmpty @tmpDetails.subject
      $('textarea', @el).val('')
      @model.get('actions').getActive().processAction @tmpDetails

  checkContent: () =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".controls-container").toggleClass 'hidden', _.isEmpty $('textarea').val()
    , 500


(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header
