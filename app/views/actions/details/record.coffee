class Tracktime.ActionView.Record extends Backbone.View
  container: '.form-control-wrapper'
  template: JST['actions/details/record']
  tmpDetails: {}
  views: {}
  events:
    'click #send-form': 'sendForm'
    'input textarea': 'textareaInput'

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()

    textarea = new Tracktime.Element.Textarea value: ''
    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.$el.textareaAutoSize().focus()

    $('placeholder#slider', @$el).replaceWith (new Tracktime.Element.Slider()).$el

    $('placeholder#selectday', @$el).replaceWith (new Tracktime.Element.SelectDay()).$el

  textareaInput: (event) =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".details-container").toggleClass 'hidden', _.isEmpty $(event.target).val()
    , 500

  sendForm: (event) =>
    event.preventDefault()
    console.lo 'send form'
    # @tmpDetails.subject = $('textarea', @el).val()
    # @actionSubmit()
    # @checkContent()

  # actionSubmit: (val) ->
  #   unless _.isEmpty @tmpDetails.subject
  #     $('textarea', @el).val('')
  #     @model.processAction @tmpDetails

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

