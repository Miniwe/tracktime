class Tracktime.ActionsView extends Backbone.View
  el: '#actions-form'
  menu: '#actions-form'
  template: JST['actions/actions']
  views: {}

  initialize: (options) ->
    _.extend @, options

    @listenTo @collection, 'change:active', @renderAction
    @listenTo @collection, 'add', @addAction
    @render()

  render: () ->
    @$el.html @template()
    @menu = $('.dropdown-menu', '.select-action', @$el)
    _.each @collection.getActions(), @addAction
    @collection.at(0).setActive()

  addAction: (action) =>
    listBtn = new Tracktime.ActionView.ListBtn model: action
    @menu.append listBtn.$el
    @setSubView "listBtn-#{listBtn.cid}", listBtn
    $('[data-toggle="tooltip"]', listBtn.$el).tooltip()

  renderAction: (action) ->
    if Tracktime.ActionView[action.get('type')]
      @$el.parents('.navbar').attr 'class', "navbar #{action.get('navbarClass')} shadow-z-1"
      @setSubView "actionDetails", new Tracktime.ActionView[action.get('type')] model: action


(module?.exports = Tracktime.ActionsView) or @Tracktime.ActionsView = Tracktime.ActionsView

