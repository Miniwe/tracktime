class Tracktime.AdminView.ActionsView extends Backbone.View
  container: '#main'
  template: JST['admin/actions']
  templateHeader: JST['admin/actions_header']
  tagName: 'ul'
  className: 'list-group'
  views: {}
  actionsTypes: ['Project', 'Record', 'User', 'Search']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Actions'}
    @$el.prepend @templateHeader()
    @renderActionsList()

  renderActionsList: () ->
    _.each @actionsTypes, (atype) =>
      actionView =  new Tracktime.AdminView.ActionView model: new Tracktime.Action[atype]()
      @$el.append actionView.el
      @setSubView "atype-#{atype}", actionView
    , @


(module?.exports = Tracktime.AdminView.ActionsView) or @Tracktime.AdminView.ActionsView = Tracktime.AdminView.ActionsView

