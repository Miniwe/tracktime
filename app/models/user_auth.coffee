class Tracktime.User.Auth extends Backbone.Model
  idAttribute: "_id"
  urlRoot: config.SERVER + '/' + ''
  defaults:
    authorized: null

  initialize: ->
    @fetch
      ajaxSync: true
      url: config.SERVER + '/auth_user'
      success: (model, response, options) =>
        @set 'authorized', true
      error: (model, response, options) =>
        @set 'authorized', false

  login: (params) ->
    @save params,
      ajaxSync: true
      url: config.SERVER + '/login'
      success: (model, response, options) =>
        @set response
        @set 'authorized', true
        $.alert "Welcome back, #{response.first_name} #{response.last_name}!"
        window.location.hash = '#records'
      error: (model, response, options) =>
        if response.responseJSON?
          @trigger 'flash', response.responseJSON.error
        else
          @trigger 'flash',
            scope: "unknown"
            msg: 'Send request error'

  signin: (params) ->
    _.extend params,
      status: 'active'
      k_status: 'active'
      updatedAt: (new Date()).toISOString()
      isDeleted: 'false'
    @save params,
      ajaxSync: true
      url: config.SERVER + '/register'
      success: (model, response, options) =>
        @set response
        @set 'authorized', true
        $.alert "Welcome, #{response.name} !"
      error: (model, response, options) =>
        @trigger 'flash', response.responseJSON.error

  forgotpasswrod: ->

  fullName: ->
    "#{@get('first_name')} #{@get('last_name')}"

  logout: ->
    $.alert "Goodbay, #{@fullName()}!"
    @set 'authorized', false
    @destroy
      ajaxSync: true
      url: config.SERVER + '/logout/' + @id
      success: (model, response, options) =>
        window.location.href = '#'
        window.location.reload()
      error: (model, response, options) =>
        console.log 'logout error'

  setActiveRecord: (record, status) ->
    if @get('activeRecord')
      Tracktime.AppChannel.command 'addTime', @get('activeRecord'), @get('startedAt')
    if status
      params =
        activeRecord: record.id
        startedAt: (new Date()).toISOString()
    else
      params =
        activeRecord: ''
        startedAt: null
    @save params,
      ajaxSync: true
      url: config.SERVER + '/users/' + @id
      success: (model, response, options) =>
        record.trigger 'isActive', status
      error: (model, response, options) =>
        @trigger 'flash', response.responseJSON.error

(module?.exports = Tracktime.User.Auth) or @Tracktime.User.Auth = Tracktime.User.Auth
