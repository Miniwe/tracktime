class Tracktime.Element.Slider extends Tracktime.Element
  className: 'slider shor btn-primary slider-material-orange'

  initialize: (options = {}) ->
    _.extend @, options
    @render()

  render: () ->
    @$el
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
    @$el
      .noUiSlider_pips
        mode: 'values'
        values: [0,60*1,60*2,60*3,60*4,60*5,60*6,60*7,60*8,60*9,60*10,60*11,60*12]
        density: 2
        format:
          to: (value) -> value / 60
          from: (value) -> value


(module?.exports = Tracktime.Element.Slider) or @Tracktime.Element.Slider = Tracktime.Element.Slider

