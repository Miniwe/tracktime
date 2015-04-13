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




(module?.exports = Tracktime.ProjectsCollection) or @Tracktime.ProjectsCollection = Tracktime.ProjectsCollection
