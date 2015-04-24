class Tracktime.GuestView.Fopass extends Backbone.View
  el: '#forgotpassword'
  events:
    'click .btn-forgotpassword': 'forgotpasswordProcess'

  initialize: () ->

  forgotpasswordProcess: (event) ->
    event.preventDefault()
    $.alert 'fopass process'


(module?.exports = Tracktime.GuestView.Fopass) or @Tracktime.GuestView.Fopass = Tracktime.GuestView.Fopass

