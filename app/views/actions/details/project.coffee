class Tracktime.ActionView.Project extends Backbone.View
  container: '.action-wrapper'
  template: JST['actions/details/project']
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
      model: @model.get 'projectModel'
      placeholder: @model.get 'title'
      field: 'name'

    $('placeholder#textarea', @$el).replaceWith textarea.$el

    $.material.input "[name=#{textarea.name}]"
    textarea.$el.textareaAutoSize().focus()
    textarea.on 'tSubmit', @sendForm

    $('placeholder#btn_close_action', @$el).replaceWith (new Tracktime.Element.ElementCloseAction
      model: @model
    ).$el if @model.get 'canClose'

  textareaInput: (event) =>
    window.setTimeout () =>
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
      $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
      $(".details-container").toggleClass 'hidden', _.isEmpty $(event.currentTarget).val()
    , 500

  sendForm: () =>
    @model.processAction()

(module?.exports = Tracktime.ActionView.Project) or @Tracktime.ActionView.Project = Tracktime.ActionView.Project

