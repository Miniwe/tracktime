class Tracktime.RecordsCollection extends Backbone.Collection
  model: Tracktime.Record
  url: config?.ROOT + '/records'
  urlRoot: config?.ROOT + '/records'
  localStorage: new Backbone.LocalStorage (config.collection.records)

  initialize: () ->
    @router = new Tracktime.RecordsRouter {controller: @}
    @syncCollection() if Tracktime.AppChannel.request 'isOnline'

  resetRecords: () ->
    delete @localStorage
    @localStorage = new Backbone.LocalStorage (config.collection.records)
    @syncCollection() if Tracktime.AppChannel.request 'isOnline'
    @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

  fetch: (options) ->
    options.success = @fetchSuccess if options.ajaxSync == true
    super options

  fetchSuccess: (collection, models, options) =>
    _.each models, (model) =>
      #find model local
      record = new Tracktime.Record(model)
      localModel = @localStorage.find record
      if localModel?
        if localModel.lastAccess < record.get('lastAccess')
          record.save(model)
        else if localModel.lastAccess > record.get('lastAccess')
          record = @get(record.id).save localModel, {patch: true}
      else
        record.save()

  comparator: (model) -> - (new Date(model.get('date'))).getTime()

  addRecord: (params, options) ->
    newRecord = new Tracktime.Record params
    if newRecord.isValid()
      @add newRecord
      unless options.ajaxSync?
        options.ajaxSync = Tracktime.AppChannel.request 'isOnline'
      newRecord.save {}, options
    else
      $.alert 'Erros validation from add record to collection'

  syncCollection: () ->
    models = @localStorage.findAll()
    _.each _.clone(models), (model) =>
      if model.isDeleted
        @localStorage.destroy (new Tracktime.Record(model))
      if model._id.length > 24
        badModel = new Tracktime.Record {_id: model._id}
        badModel.fetch {ajaxSync: false}
        newModel = badModel.toJSON()
        delete newModel._id
        @addRecord newModel,
          success: (model, response) =>
            badModel.destroy {ajaxSync: false}


(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
