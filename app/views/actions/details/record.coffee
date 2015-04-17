class Tracktime.ActionView.Record extends Backbone.View
  container: '.form-control-wrapper'
  template: JST['actions/details/record']
  views: {}
  events:
    'click #send-form': 'sendForm'
    'input textarea': 'textareaInput'

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()

    textarea = new Tracktime.Element.Textarea
      model: @model.get 'recordModel'
      field: 'subject'

    $('placeholder#textarea', @$el).replaceWith textarea.$el
    textarea.$el.textareaAutoSize().focus()
    textarea.on 'tSubmit', @sendForm

    $('placeholder#slider', @$el).replaceWith (new Tracktime.Element.Slider
      model: @model.get 'recordModel'
      field: 'recordTime'
    ).$el

    $('placeholder#selectday', @$el).replaceWith (new Tracktime.Element.SelectDay
      model: @model.get 'recordModel'
      field: 'recordDate'
    ).$el

    $('placeholder#btn_close_action', @$el).replaceWith (new Tracktime.Element.ElementCloseAction
      model: @model
    ).$el if @model.get 'canClose'

  textareaInput: (event) =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".details-container").toggleClass 'hidden', _.isEmpty $(event.target).val()
    , 500

  sendForm: () =>
    @model.processAction()

(module?.exports = Tracktime.ActionView.Record) or @Tracktime.ActionView.Record = Tracktime.ActionView.Record

