class Tracktime.Collection extends Backbone.Collection
  addModel: (params, options) ->
    newModel = new @model params
    if newModel.isValid()
      @add newModel
      unless options.ajaxSync?
        options.ajaxSync = Tracktime.AppChannel.request 'isOnline'
      newModel.save {}, options
    else
      $.alert 'Erros validation from add curModel to collection'

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
      curModel = @get(model._id)
      localModel = @localStorage.find curModel
      # если нет локальной то сохраняем (локально)
      unless localModel
        curModel.save ajaxSync: false
      # иначе
      else
        # если локальная старее то обновляем с новых данных (локально)
        modelUpdatetAt = (new Date(model.updatedAt)).getTime()
        localUpdatetAt = (new Date(localModel.updatedAt)).getTime()
        if localModel.isDeleted
          # do nothing
          curModel.set {'isDeleted': true},  {trigger: false}
        else if localUpdatetAt < modelUpdatetAt
          curModel.save model, ajaxSync: false
        # иначе есть если локальная новее то
        else if localUpdatetAt > modelUpdatetAt
          # обновляем модель пришедшую в коллекции
          # сохраняем ее удаленно
          curModel.save localModel, ajaxSync: true

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
          modelUpdatetAt = (new Date(model.updatedAt)).getTime()
          if collectionModel? and modelUpdatetAt > (new Date(collectionModel.get('updatedAt'))).getTime()
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
          @addModel newModel,
            success: (model, response) =>
              # заменяем на новосохраненную
              replacedModel.destroy {ajaxSync: false}


  resetLocalStorage: () ->
    @localStorage = new Backbone.LocalStorage @collectionName


(module?.exports = Tracktime.Collection) or @Tracktime.Collection = Tracktime.Collection
