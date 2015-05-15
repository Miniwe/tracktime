Backbone.ViewMixin =
  close: () ->
    @onClose() if @onClose

    if @container?
      $(@container).unbind()

    @undelegateEvents()
    @$el.removeData().unbind()
    @remove()
    Backbone.View.prototype.remove.call @
    return

  onClose: ->
    for own key, view of @views
      view.close()
      delete @views[key]

  clear: ->
    @onClose()

  setSubView: (key, view) ->
    @views[key].close() if key of @views
    @views[key] = view

  getSubView: (key) ->
    @views[key] if key of @views

Backbone.View.prototype extends Backbone.ViewMixin
