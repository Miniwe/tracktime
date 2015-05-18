class Tracktime.ProjectsCollection extends Tracktime.Collection
  model: Tracktime.Project
  collectionName: config.collection.projects
  url: config?.SERVER + '/projects'
  urlRoot: config?.SERVER + '/projects'
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    @on 'sync', @makeList

  comparator: (model) ->
    - (new Date(model.get('date'))).getTime()

  addProject: (options) ->
    _.extend options, {date: (new Date()).toISOString()}
    success = (result) =>
      $.alert
        content: 'Project: save success'
        timeout: 2000
        style: 'btn-success'
    error = () =>
      $.alert 'Project: save error'
    @addModel options,
      success: success,
      error: error

  makeList: (collection, models) ->
    list = {}
    _.each collection.models, (model, index) ->
      list[model.get('_id')] = model.get('name')
    Tracktime.AppChannel.reply 'projectsList', () -> list


(module?.exports = Tracktime.ProjectsCollection) or @Tracktime.ProjectsCollection = Tracktime.ProjectsCollection
