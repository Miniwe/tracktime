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
    @syncCollection() if Tracktime.AppChannel.request 'isOnline'

  comparator: (model) -> -model.get('date')

  clearLocalstorage: () ->
    # models = @localStorage.findAll()
    # @add models
    # _.each _.clone(@models), (model) ->
    #   model.destroy()

  syncCollection: () ->
    models = @localStorage.findAll()
    _localStorage = @localStorage
    _.each _.clone(models), (model) =>
      console.log 'will be checked', model
      if model.isDeleted
        @localStorage.destroy (new Tracktime.Record(model))

        # @localstorage.destroy(model)
    # удалить isDeleted
    #   а так же удалить из коллекции если есть
    # при неверном номере
      # отправить на remote сохранение данные из неверного номера
        # при успешном сохранении
        # удалить исходное
        # сохранить на локалке и добавить в коллекцию



(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
