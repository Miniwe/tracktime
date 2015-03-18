class Tracktime.RecordView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item'

  initialize: () ->
    @render()

  attributes: () ->
    id: @model.cid

  render: () ->
    @$el.html('')
      .append $("<div>", {class: 'least-content'}).html @model.cid
      .append $("<h4>", {class: 'list-group-item-heading'}).html @model.get 'subject'
      .append $("<p>", {class: 'list-group-item-text'}).html @model.get 'description'

(module?.exports = Tracktime.RecordView) or @Tracktime.RecordView = Tracktime.RecordView

