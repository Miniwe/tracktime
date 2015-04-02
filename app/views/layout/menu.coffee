class Tracktime.AppView.Menu extends Backbone.View
  el: '#menu'
  template: JST['layout/menu']
  events:
    'change #isOnline': 'updateOnlineStatus'

  initialize: () ->
    @render()
    @bindEvents()

  bindEvents: ->
    @listenTo @model, 'change:isOnline', () ->
      $('#isOnline').prop 'checked', @model.get 'isOnline'

  updateOnlineStatus: (event) ->
    @model.set 'isOnline', $(event.target).is(":checked")

  render: () ->
    @$el.html @template @model?.toJSON()


(module?.exports = Tracktime.AppView.Menu) or @Tracktime.AppView.Menu = Tracktime.AppView.Menu

