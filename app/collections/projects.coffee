class Tracktime.ProjectsCollection extends Tracktime.Collection
  model: Tracktime.Project
  url: config?.SERVER + '/projects'
  urlRoot: config?.SERVER + '/projects'
  collectionName: config.collection.projects
  localStorage: new Backbone.LocalStorage @collectionName

  initialize: () ->
    @fetch ajaxSync: Tracktime.AppChannel.request 'isOnline'

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


(module?.exports = Tracktime.ProjectsCollection) or @Tracktime.ProjectsCollection = Tracktime.ProjectsCollection
