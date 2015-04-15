class Tracktime.Element.Textarea extends Tracktime.Element
  tagName: 'textarea'
  events:
    'click': 'sayHello'

  initialize: (options = {}) ->
    _.extend @, options
    @render()

  render: () ->
    # @setElement "#antextarea"
    # @$el
    @$el.val 'textarea'

  sayHello: () ->
    $.alert 'HELLO !!'

(module?.exports = Tracktime.Element.Textarea) or @Tracktime.Element.Textarea = Tracktime.Element.Textarea

