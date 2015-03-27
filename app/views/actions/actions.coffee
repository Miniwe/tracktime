class Tracktime.ActionsView extends Backbone.View
  el: '#actions-form'
  className: 'actions-group'
  template: JST['layout/header/actions']

  initialize: () ->
    @render()

  render: () ->
    @$el.html @template()
    dropdown = $('.select-action-type-dropdown', @$el)

    #add to select-action-type-dropdown in ul all - but selected mast be hidden
    ul = dropdown.find '.dropdown-menu'
    _.each @collection.getVisible(), (action) ->
      listBtn = new Tracktime.ActionView.ListBtn model: action, container: dropdown
      ul.append listBtn.$el
      $(listBtn.$el).click() if action.get 'isActive'


(module?.exports = Tracktime.ActionsView) or @Tracktime.ActionsView = Tracktime.ActionsView

