class Tracktime.Element.Textarea extends Tracktime.Element
  tagName: 'textarea'
  className: 'form-control'
  events:
    'keydown': 'fixEnter'

  initialize: (options = {}) ->
    _.extend @, options
    @render()

  render: () ->
    @$el.attr 'name', 'action_text'
    @$el.val @value

  fixEnter: (event) =>
    if event.keyCode == 13 and event.shiftKey
      event.preventDefault()
      console.log 'call textarea submit'
      # @tmpDetails.subject = $('textarea', @el).val()
      # @actionSubmit()

  checkContent: () =>
    console.log 'check content'
    # window.setTimeout () =>
    #   diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true)
    #   $('#actions-form').toggleClass "shadow-z-2", (diff > 10)
    #   $(".details-container").toggleClass 'hidden', _.isEmpty $('textarea').val()
    # , 500



(module?.exports = Tracktime.Element.Textarea) or @Tracktime.Element.Textarea = Tracktime.Element.Textarea

