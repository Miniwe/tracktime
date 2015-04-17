class Tracktime.Action extends Backbone.Model

  idAttribute: "_id"
  url: '/actions' #receive on activate actions for user (!)

  defaults:
    _id: null
    title: 'Default action'
    isActive: null
    isVisible: false
    canClose: false

  attributes: () ->
    id: @model.cid

  setActive: () ->
    @collection.setActive @

  processAction: (options) ->
    $.alert 'Void Action'

(module?.exports = Tracktime.Action) or @Tracktime.Action = Tracktime.Action
