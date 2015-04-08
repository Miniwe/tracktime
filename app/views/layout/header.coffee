class Tracktime.AppView.Header extends Backbone.View
  el: '#header'
  template: JST['layout/header']
  childViews: {}
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

    @tmpDetails.date = $(".select-date > .btn .caption ruby rt").html()
    $(".select-date .dropdown-menu .btn").on 'click', (event) =>
      event.preventDefault()
      $(".select-date > .btn .caption ruby").html $(event.target).find('ruby').html()
      @tmpDetails.date = $(".select-date > .btn .caption ruby rt").html()
    $(".slider")
      .noUiSlider start: [1], range: {'min': [ 0 ], 'max': [ 720 ] }
      .on
        slide: (event, val) =>
          @tmpDetails.time = val
          currentHour = val / 720 * 12
          hour = Math.floor(currentHour)
          minute = (currentHour - hour) * 60
          $('.slider .noUi-handle').attr 'data-before', hour
          $('.slider .noUi-handle').attr 'data-after', Math.round(minute)


  render: () ->
    @$el.html @template @model?.toJSON()
    @childViews['actions'] = new Tracktime.ActionsView
      collection: @model.get('actions')
      container: @

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
      console.log '@tmpDetails', @tmpDetails
      @model.get('actions').getActive().processAction @tmpDetails

  checkContent: () =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".controls-container").toggleClass 'hidden', _.isEmpty $('textarea').val()
    , 500


(module?.exports = Tracktime.AppView.Header) or @Tracktime.AppView.Header = Tracktime.AppView.Header
