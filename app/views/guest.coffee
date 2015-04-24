class Tracktime.GuestView extends Backbone.View
  container: '#panel'
  className: ''
  template: JST['global/guest']
  views: {}
  events:
    'click .btn-login': 'auth'

  initialize: ->
    @render()

  render: ->
    $(@container).html @$el.html @template @model.toJSON()

  initUI: ->
    $.material.init()

  auth: ->
    @model.changeUserStatus true


(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

