class Tracktime.RecordsCollection extends Backbone.Collection
  model: Tracktime.Record
  url: config?.ROOT + '/records'
  urlRoot: config?.ROOT + '/records'
  localStorage: null

  initialize: () ->
    @router = new Tracktime.RecordsRouter {controller: @}
    # @resetRecords()
    # # @clearLocalstorage()
    # models = @localStorage.findAll()

    # unless models.length
    #   _.each Tracktime.initdata.tmpRecords, (record) ->
    #     newRecord = new Tracktime.Record _.extend {date: (new Date()).getTime()}, record
    #     newRecord.save()
    #   models = @localStorage.findAll()

    # @add models
  resetRecords: () ->
    delete @localStorage
    @localStorage = new Backbone.LocalStorage ('records-backbone')
    @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  comparator: (model) -> -model.get('date')

  clearLocalstorage: () ->
    # models = @localStorage.findAll()
    # @add models
    # _.each _.clone(@models), (model) ->
    #   model.destroy()


(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
