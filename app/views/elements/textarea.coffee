class Tracktime.Element.Textarea extends Tracktime.Element
  tagName: 'textarea'
  className: 'form-control'
  events:
    'keydown': 'fixEnter'
    'change': 'changeInput'

  initialize: (options = {}) ->
    _.extend @, options
    @render()
    @listenTo @model, "change:#{@field}", @changeField

  render: () ->
    @$el.attr 'name', 'action_text'
    @$el.val @model.get @field

  changeField: () =>
    @$el.val(@model.get @field).trigger('input')

  changeInput: (event) =>
    @model.set @field, $(event.target).val(), {silent: true}

  fixEnter: (event) =>
    if event.keyCode == 13 and event.shiftKey
      event.preventDefault()
      console.log 'call textarea submit'
      @trigger 'tSubmit'


(module?.exports = Tracktime.Element.Textarea) or @Tracktime.Element.Textarea = Tracktime.Element.Textarea

