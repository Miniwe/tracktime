class Tracktime.RecordsCollection extends Backbone.Collection
  model: Tracktime.Record
  url: config?.SERVER + '/records'
  urlRoot: config?.SERVER + '/records'
  localStorage: new Backbone.LocalStorage (config.collection.records)

  initialize: () ->
    # @router = new Tracktime.RecordsRouter {controller: @}

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

  fetch: (options) ->
    @resetLocalStorage()
    if options? and options.ajaxSync == true
      _success = options.success
      options.success = (collection, response, optionsSuccess) =>
        @syncRecords(response)
        _success.apply(@, collection, response, options) if _.isFunction(_success)
    super options

  syncRecords: (models) ->

    # по всем remote model которые вроде как в коллекции уже
    _.each models, (model) =>
      record = @get(model._id)
      localModel = @localStorage.find record
      # если нет локальной то сохраняем (локально)
      unless localModel
        record.save ajaxSync: false
      # иначе
      else
        # если локальная старее то обновляем с новых данных (локально)
        modelLastAccess = (new Date(model.lastAccess)).getTime()
        localLastAccess = (new Date(localModel.lastAccess)).getTime()
        if localModel.isDeleted
          # do nothing
          record.set {'isDeleted': true},  {trigger: false}
        else if localLastAccess < modelLastAccess
          record.save model, ajaxSync: false
        # иначе есть если локальная новее то
        else if localLastAccess > modelLastAccess
          # обновляем модель пришедшую в коллекции
          # сохраняем ее удаленно
          record.save localModel, ajaxSync: true

    # по всем local моделям
    localModels = @localStorage.findAll()
    _.each _.clone(localModels), (model) =>
      collectionModel = @get(model._id)
      # если удалена
      if model.isDeleted
        modelLastAccess = (new Date(model.lastAccess)).getTime()
        if collectionModel? and modelLastAccess > (new Date(collectionModel.get('lastAccess'))).getTime()
          destroedModel = collectionModel
        else
          destroedModel = new Tracktime.Record(model)
        # то удаляем локально и удаленно
        # и из коллекции если есть
        destroedModel.destroy ajaxSync: true
      else
        # если нет в коллекции
        unless collectionModel
          replacedModel = new Tracktime.Record {_id: model._id}
          replacedModel.fetch {ajaxSync: false}
          newModel = replacedModel.toJSON()
          delete newModel._id
          # то сохраняем ее удаленно
          # добавляем в коллекцию
          @addRecord newModel,
            success: (model, response) =>
              # заменяем на новосохраненную
              replacedModel.destroy {ajaxSync: false}


  resetLocalStorage: () ->
    @localStorage = new Backbone.LocalStorage (config.collection.records)



(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
