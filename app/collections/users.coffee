class Tracktime.UsersCollection extends Tracktime.Collection
  model: Tracktime.User
  collectionName: config.collection.users
  url: config?.SERVER + '/' + 'users'
  urlRoot: config?.SERVER + '/' + 'users'
  localStorage: new Backbone.LocalStorage 'users'

  initialize: () ->
    @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  comparator: (model) ->
    - (new Date(model.get('date'))).getTime()

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


(module?.exports = Tracktime.UsersCollection) or @Tracktime.UsersCollection = Tracktime.UsersCollection
