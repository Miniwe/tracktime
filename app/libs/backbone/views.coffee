Backbone.ViewMixin =
  close: () ->
    @onClose() if @onClose
    @unbind()
    @remove()
    return

  onClose: ->
    for own key, view of @views
      view.close(key)

  setSubView: (key, view) ->
    @views[key].close() if @views[key]
    @views[key] = view

  getSubView: (key) ->
    @views[key] if @views[key]

Backbone.View.prototype extends Backbone.ViewMixin