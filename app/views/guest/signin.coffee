class Tracktime.GuestView.Signin extends Backbone.View
  el: '#signin > form'
  events:
    'submit': 'signinProcess'

  initialize: () ->
    @listenTo @model.get('authUser'), 'flash', @showFlash

  signinProcess: (event) ->
    event.preventDefault()
    if @checkInput()
      @model.get('authUser').signin
        first_name: $('[name=first_name]',@$el).val()
        last_name: $('[name=last_name]',@$el).val()
        email: $('[name=email]',@$el).val()
        password: $('[name=password]',@$el).val()

  checkInput: ->
    result = true
    if _.isEmpty $('[name=first_name]',@$el).val()
      @showFlash scope: "Signin", msg: 'First Name empty'
      result = false
    if _.isEmpty $('[name=last_name]',@$el).val()
      @showFlash scope: "Signin", msg: 'Last Name empty'
      result = false
    if _.isEmpty $('[name=email]',@$el).val()
      @showFlash scope: "Signin", msg: 'Email empty'
      result = false
    if _.isEmpty $('[name=password]',@$el).val()
      @showFlash scope: "Signin", msg: 'Password empty'
      result = false
    if $('[name=password]',@$el).val() != $('[name=repassword]',@$el).val()
      @showFlash scope: "Signin", msg: 'Repassword incorrect'
      result = false
    result

  showFlash: (message) ->
    $.alert
      content: message.scope.capitalizeFirstLetter() + " Error: #{message.msg}"
      style: "btn-danger"


(module?.exports = Tracktime.GuestView.Signin) or @Tracktime.GuestView.Signin = Tracktime.GuestView.Signin
