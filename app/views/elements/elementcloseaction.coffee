class Tracktime.Element.ElementCloseAction extends Tracktime.Element
  tagName: 'button'
  className: 'btn btn-close-action btn-fab btn-flat btn-fab-mini'
  hint: 'Cancel action'
  events:
    'click': 'closeAction'

  initialize: (options = {}) ->
    _.extend @, options
    @render()

  render: () ->
    @$el
      .attr 'title', @hint
      .append $('<i />', class: 'mdi-content-remove')

  closeAction: () =>
    @model.destroy()


(module?.exports = Tracktime.Element.ElementCloseAction) or @Tracktime.Element.ElementCloseAction = Tracktime.Element.ElementCloseAction

