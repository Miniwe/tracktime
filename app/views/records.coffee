class Tracktime.RecordsView extends Backbone.View
  tagName: 'ul'
  className: 'list-group'

  initialize: () ->
    @$el.append "<hr>0</hr>"
    @render()
    @$el.append "<hr>1</hr>"
    @render()
    @$el.append "<hr>2</hr>"
    @render()
    @$el.append "<hr>3</hr>"
    @render()
    @$el.append "<hr>4</hr>"
    @render()
    @$el.append "<hr>5</hr>"
    @render()
    @$el.append "<hr>6</hr>"

  render: () ->
    _.each @collection.models, (record) =>
      recordView = new Tracktime.RecordView { model: record }
      @$el.append recordView.el
    , @


(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView

