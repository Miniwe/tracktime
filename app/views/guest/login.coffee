class Tracktime.GuestView.Login extends Backbone.View
  el: '#login'
  events:
    'click .btn-login': 'loginProcess'

  initialize: () ->

  loginProcess: (event) ->
    event.preventDefault()
    $.alert 'login process'
    @auth()

  auth: ->
    @model.changeUserStatus true

(module?.exports = Tracktime.GuestView.Login) or @Tracktime.GuestView.Login = Tracktime.GuestView.Login

