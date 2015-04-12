Backbone.ViewDecorator =
  views: {}

  close: ->
    if @onClose
      @onClose()
    console.log 'close', @, @el
    # if @prototype.el?
    #   console.log 'will clear'
    # else
    #   console.log 'will remove'
    @remove()
    return

  protoEl: ->
    @prototype

  onClose: ->
    for own key, view of @views
      view.close()

  setView: (key, view) ->
    console.log 'set', view, view.el
    @views[key].close() if @views[key]
    @views[key] = view

  getView: (key) ->
    @views[key] if @views[key]

Backbone.View.prototype extends Backbone.ViewDecorator
