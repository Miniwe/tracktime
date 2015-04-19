class Tracktime.AdminView.ActionView extends Backbone.View
  tagName: 'li'
  className: 'list-group-item'
  template: JST['actions/admin_action']
  events:
    'click .btn-call-action': "callAction"
    'click .edit.btn': "editAction"


  initialize: ->
    @render()

  render: ->
    @$el.html @template @model.toJSON()

  editAction: ->

  callAction: ->
    $.alert 'Test action call'


(module?.exports = Tracktime.AdminView.ActionView) or @Tracktime.AdminView.ActionView = Tracktime.AdminView.ActionView

