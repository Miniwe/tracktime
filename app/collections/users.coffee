class Tracktime.UsersCollection extends Tracktime.Collection
  model: Tracktime.User
  collectionName: config.collection.users
  url: config?.SERVER + '/users'
  urlRoot: config?.SERVER + '/users'
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    # @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'
    @on 'sync', @makeList

  addUser: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'User: save success'
        timeout: 2000
        style: 'btn-success'
    error = () =>
      $.alert 'User: save error'
    @addModel options,
      success: success,
      error: error

  makeList: (collection, models) ->
    list = []
    _.each collection.models, (model, index) ->
      list[model.get('_id')] = "#{model.get('first_name')} #{model.get('last_name')}"
    Tracktime.AppChannel.reply 'usersList', () -> list


(module?.exports = Tracktime.UsersCollection) or @Tracktime.UsersCollection = Tracktime.UsersCollection
