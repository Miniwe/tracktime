class Tracktime.Element.SelectDay extends Tracktime.Element
  className: 'btn-group select-day'
  template: JST['elements/selectday']
  events:
    'click button.btn': 'setDay'

  initialize: (options = {}) ->
    # @tmpDetails.recordDate = $(".select-day > .btn .caption ruby rt").html()
    _.extend @, options
    @render()
    @changeField()
    @listenTo @model, "change:#{@field}", @changeField

  render: ->
    @$el.html @template @setDays()

  setDays: ->
    moment = window.moment
    localeData = moment.localeData('ru')

    current:
      name: localeData.weekdays(moment())
      day: moment().format("MMM Do YYYY")
    days: [
      name: localeData.weekdays(moment().subtract(2, 'days'))
      day: moment().subtract(2, 'day').format("MMM Do YYYY")
    ,
      name: localeData.weekdays(moment().subtract(1, 'day'))
      day: moment().subtract(1, 'day').format("MMM Do YYYY")
    ,
      name: localeData.weekdays(moment())
      day: moment().format("MMM Do YYYY")
    ]

  changeField: =>
    # @$el.val @model.get @field
    # найти в списке тот день который есть в field и нажать на эту кнопку

  changeInput: (value) =>
    @model.set @field, value, {silent: true}

  setDay: (event) ->
    event.preventDefault()
    $(".dropdown-toggle ruby", @$el).html $('ruby', event.currentTarget).html()
    @changeInput $(".dropdown-toggle ruby rt", @$el).html()


(module?.exports = Tracktime.Element.SelectDay) or @Tracktime.Element.SelectDay = Tracktime.Element.SelectDay

