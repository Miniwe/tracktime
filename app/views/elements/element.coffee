class Tracktime.Element extends Backbone.View

  initialize: () ->
    @render()

  render: () ->
    @$el.html 'void element'


(module?.exports = Tracktime.Element) or @Tracktime.Element = Tracktime.Element

