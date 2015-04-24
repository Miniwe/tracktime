class Tracktime.GuestView extends Backbone.View
  container: '#panel'
  className: ''
  template: JST['global/guest']
  views: {}

  initialize: ->
    @render()

  render: ->
    $(@container).html @$el.html @template @model.toJSON()
    @setSubView 'login', new Tracktime.GuestView.Login model: @model
    @setSubView 'signin', new Tracktime.GuestView.Signin model: @model
    @setSubView 'fopass', new Tracktime.GuestView.Fopass model: @model

  initUI: ->
    $.material.init()


(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

