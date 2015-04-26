class Tracktime.User.Auth extends Backbone.Model
  urlRoot: config.SERVER + '/' + ''
  defaults:
    authorized: false

  login: (params) ->
    @save params,
      ajaxSync: true
      url: config.SERVER + '/login'
      success: (model, response, options) =>
        @set response
        @set 'authorized', true
        $.alert "Welcome back, #{response.first_name} #{response.last_name}!"
      error: (model, response, options) =>
        if response.responseJSON?
          @trigger 'flash', response.responseJSON.error
        else
          @trigger 'flash',
            scope: "unknown"
            msg: 'Send request error'

  signin: (params) ->
    @save params,
      ajaxSync: true
      url: config.SERVER + '/signin'
      success: (model, response, options) =>
        @set response
        @set 'authorized', true
        $.alert "Welcome, #{response.name} !"
      error: (model, response, options) =>
        @trigger 'flash', response.responseJSON.error

  forgotpasswrod: ->

  logout: ->
    $.alert "Goodbay, #{@get('first_name')} #{@get('last_name')}!"
    @clear()

(module?.exports = Tracktime.User.Auth) or @Tracktime.User.Auth = Tracktime.User.Auth
