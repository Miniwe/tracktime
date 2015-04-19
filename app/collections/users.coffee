class Tracktime.UsersCollection extends Tracktime.Collection
  model: Tracktime.User
  collectionName: config.collection.users
  url: config?.SERVER + '/' + @collectionName
  urlRoot: config?.SERVER + '/' + @collectionName
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    # @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

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
