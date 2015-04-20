#<textarea class="form-control floating-label" placeholder="textarea floating label"></textarea>
class Tracktime.Element.Textarea extends Tracktime.Element
  name: 'action_text'
  tagName: 'textarea'
  className: 'form-control floating-label'
  events:
    'keydown': 'fixEnter'
    'keyup': 'changeInput'
    'change': 'changeInput'

  initialize: (options = {}) ->
    _.extend @, options
    @name = "#{@name}-#{@model.cid}"
    @render()
    @listenTo @model, "change:#{@field}", @changeField

  render: () ->
    @$el.attr 'name', @name
    @$el.attr 'placeholder', @placeholder
    @$el.val @model.get @field

  changeField: () =>
    @$el.val(@model.get @field).trigger('input')

  changeInput: (event) =>
    @model.set @field, $(event.target).val(), {silent: true}

  fixEnter: (event) =>
    if event.keyCode == 13 and not event.shiftKey
      event.preventDefault()
      @trigger 'tSubmit'


(module?.exports = Tracktime.Element.Textarea) or @Tracktime.Element.Textarea = Tracktime.Element.Textarea

