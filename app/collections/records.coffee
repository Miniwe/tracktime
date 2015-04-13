class Tracktime.RecordsCollection extends Tracktime.Collection
  model: Tracktime.Record
  url: config?.SERVER + '/records'
  urlRoot: config?.SERVER + '/records'
  collectionName: config.collection.records
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  comparator: (model) ->
    - (new Date(model.get('date'))).getTime()




(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
