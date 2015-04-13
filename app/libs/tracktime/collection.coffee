class Tracktime.Collection extends Backbone.Collection
  addRecord: (params, options) ->
    newRecord = new @model params
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
        @syncCollection(response)
        _success.apply(@, collection, response, options) if _.isFunction(_success)
    super options

  syncCollection: (models) ->
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
        if model._id.length > 24
          destroedModel = new @model {_id: model._id, subject: 'model to delete'}
          destroedModel.destroy ajaxSync: false
        else
          modelLastAccess = (new Date(model.lastAccess)).getTime()
          if collectionModel? and modelLastAccess > (new Date(collectionModel.get('lastAccess'))).getTime()
            destroedModel = collectionModel
          else
            destroedModel = new @model (model)
          # то удаляем локально и удаленно
          # и из коллекции если есть
          destroedModel.destroy ajaxSync: true
      else
        # если нет в коллекции
        unless collectionModel
          replacedModel = new @model {_id: model._id}
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
    @localStorage = new Backbone.LocalStorage @collectionName


(module?.exports = Tracktime.Collection) or @Tracktime.Collection = Tracktime.Collection
