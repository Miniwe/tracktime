class Tracktime.GuestView.Signin extends Backbone.View
  el: '#signin'
  events:
    'click .btn-signin': 'signinProcess'

  initialize: () ->

  signinProcess: (event) ->
    event.preventDefault()
    $.alert 'signin process'


(module?.exports = Tracktime.GuestView.Signin) or @Tracktime.GuestView.Signin = Tracktime.GuestView.Signin

