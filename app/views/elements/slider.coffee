class Tracktime.Element.Slider extends Tracktime.Element
  tagName: 'select'
  events:
    'click': 'sayHello'

  initialize: (options = {}) ->
    _.extend @, options
    @render()

  render: () ->
    # @setElement "#anSlider"
    # @$el
    @$el.val 'Slider'

  sayHello: () ->
    $.alert 'HELLO Slider!!'

(module?.exports = Tracktime.Element.Slider) or @Tracktime.Element.Slider = Tracktime.Element.Slider

