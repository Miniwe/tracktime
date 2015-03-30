class Tracktime.RecordsCollection extends Backbone.Collection
  model: Tracktime.Record
  url: () -> @urlRoot('/records')
  # localStorage: new Backbone.LocalStorage ('records-backbone')
  comparator: (model) -> -model.get('date')

  initialize: () ->
    @router = new Tracktime.RecordsRouter {controller: @}

    # console.log @, @url()
    @fetch ajaxSync: true
    # # @clearLocalstorage()
    # models = @localStorage.findAll()

    # unless models.length
    #   _.each Tracktime.initdata.tmpRecords, (record) ->
    #     newRecord = new Tracktime.Record _.extend {date: (new Date()).getTime()}, record
    #     newRecord.save()
    #   models = @localStorage.findAll()

    # @add models

  clearLocalstorage: () ->
    # models = @localStorage.findAll()
    # @add models
    # _.each _.clone(@models), (model) ->
    #   model.destroy()


(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
