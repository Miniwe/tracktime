class Tracktime.GuestView.Login extends Backbone.View
  el: '#login > form'
  events:
    'submit': 'loginProcess'

  initialize: () ->
    @listenTo @model.get('authUser'), 'flash', @showFlash

  loginProcess: (event) ->
    event.preventDefault()
    @model.get('authUser').login
      email: $('[name=email]',@$el).val()
      password: $('[name=password]',@$el).val()

  showFlash: (message) ->
    $.alert message.scope.capitalizeFirstLetter() + " Error: #{message.msg}"

(module?.exports = Tracktime.GuestView.Login) or @Tracktime.GuestView.Login = Tracktime.GuestView.Login

