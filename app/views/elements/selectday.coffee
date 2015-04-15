class Tracktime.Element.SelectDay extends Tracktime.Element
  className: 'btn-group select-day'
  template: JST['elements/selectday']
  events:
    'click button.btn': 'setDay'

  initialize: (options = {}) ->
    # @tmpDetails.recordDate = $(".select-day > .btn .caption ruby rt").html()
    _.extend @, options
    @render()

  render: () ->
    @$el.html @template()

  setDay: (event) ->
    event.preventDefault()
    $(".dropdown-toggle ruby", @$el).html $('ruby', event.currentTarget).html()
    # @tmpDetails.recordDate = $(".select-day > .btn .caption ruby rt").html()


(module?.exports = Tracktime.Element.Slider) or @Tracktime.Element.Slider = Tracktime.Element.Slider

