class Tracktime.RecordsCollection extends Tracktime.Collection
  model: Tracktime.Record
  collectionName: config.collection.records
  url: config?.SERVER + '/' + 'records'
  urlRoot: config?.SERVER + '/' + 'records'
  localStorage: new Backbone.LocalStorage 'records'

  initialize: () ->
    # @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  comparator: (model) ->
    - (new Date(model.get('date'))).getTime()

  addRecord: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'Record: save success'
        timeout: 2000
        style: 'btn-success'
    error = () =>
      $.alert 'Record: save error'
    @addModel options,
      success: success,
      error: error


(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
