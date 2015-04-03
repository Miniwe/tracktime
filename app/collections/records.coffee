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

  addRecord: (params, options) ->
    newRecord = new Tracktime.Record params
    if newRecord.isValid()
      @add newRecord
      newRecord.save {},
        ajaxSync: options.ajaxSync || Tracktime.AppChannel.request 'isOnline'
        success: options.success
        error: options.error
    else
      $.alert 'Erros validation from add record to collection'

  syncCollection: () ->
    models = @localStorage.findAll()
    _localStorage = @localStorage
    _.each _.clone(models), (model) =>
      if model.isDeleted
        @localStorage.destroy (new Tracktime.Record(model))
      if model._id.length > 24
        modelData = model
        delete modelData._id
        @addRecord modelData,
          ajaxSync: false
          success: (model, response) =>
            console.log 'add success', 'will delete'
            @localStorage.destroy model


(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
