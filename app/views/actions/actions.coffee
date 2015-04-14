class Tracktime.ActionsView extends Backbone.View
  el: '#actions-form'
  template: JST['actions/actions']
  views: {}

  initialize: (options) ->
    _.extend @, options
    @listenTo @collection, 'change:active', @renderAction
    @render()

  render: () ->
    @$el.html @template()
    dropdown = $('.select-action', @$el)

    ul = dropdown.find '.dropdown-menu'
    _.each @collection.getActions(), (action) =>
      listBtn = new Tracktime.ActionView.ListBtn model: action
      ul.append listBtn.$el
      @setSubView "listBtn-#{listBtn.cid}", listBtn
    @collection.at(0).setActive()

  renderAction: (action) ->
    @$el.parents('.navbar').attr 'class', "navbar #{action.get('navbarClass')} shadow-z-1"

    if Tracktime.ActionView[action.get('type')]
      @setSubView "actionDetails", new Tracktime.ActionView[action.get('type')] model: action

(module?.exports = Tracktime.ActionsView) or @Tracktime.ActionsView = Tracktime.ActionsView

