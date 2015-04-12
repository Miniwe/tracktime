class Tracktime.AppView extends Backbone.View
  el: '#panel'
  className: ''
  layoutTemplate: JST['global/app']
  views: {}

  initialize: ->
    @render()

  render: ->
    # $(document).title @model.get 'title'
    @$el.html @layoutTemplate @model.toJSON()

  initUI: ->
    $.material.init()


(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

