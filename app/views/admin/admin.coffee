class Tracktime.AdminView extends Backbone.View
  el: '#panel'
  className: ''
  template: JST['admin/index']
  views: {}

  initialize: ->
    @render()

  render: ->
    # $(document).title @model.get 'title'
    @$el.html @template()

  initUI: ->
    $.material.init()


(module?.exports = Tracktime.AdminView) or @Tracktime.AdminView = Tracktime.AdminView

