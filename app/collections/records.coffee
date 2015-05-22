class Tracktime.RecordsCollection extends Tracktime.Collection
  model: Tracktime.Record
  collectionName: config.collection.records
  url: config?.SERVER + '/records'
  urlRoot: config?.SERVER + '/records'
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    @filter = {}
    @defaultFilter = isDeleted: false

  comparator: (model) ->
    - (new Date(model.get('date'))).getTime()

  setFilter: (filter) ->
    @resetFilter()
    unless filter == null
      pairs = filter.match(/((user|project)\/[a-z0-9A-Z]{24})+/g)
      if pairs
        _.each pairs, (pair, index) ->
          _p = pair.split '/'
          @filter[_p[0]] = _p[1]
        , @
    @filter

  resetFilter: ->
    @filter = _.clone @defaultFilter

  removeFilter: (key) ->
    if key of @filter
      delete @filter[key]

  getFilter: (removeDefault = true) ->
    result = {}
    if removeDefault
      keys = _.keys @defaultFilter
      result = _.omit @filter, keys
    else
      result = @filter
    result

  addRecord: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    options.recordDate = moment().format("MMM Do YYYY") if _.isEmpty(options.recordDate)
    success = (result) =>
      $.alert
        content: 'Record: save success'
        timeout: 2000
        style: 'btn-success'
      @trigger 'newRecord'
    error = () =>
      $.alert 'Record: save error'
    @addModel options,
      success: success,
      error: error

  getModels: (except = []) ->
    models = {}
    limit = 6
    if @length > 0
      fmodels = _.filter @models, (model) =>
        model.isSatisfied @filter
      models = fmodels
    else
      models = @models
    outmodels = _.filter models, (model) ->
      _.indexOf(except, model.id) == -1
    _.first outmodels, limit

(module?.exports = Tracktime.RecordsCollection) or @Tracktime.RecordsCollection = Tracktime.RecordsCollection
