class Tracktime.AppView extends Backbone.View
  el: '#panel'
  className: ''
  layoutTemplate: JST['global/app']
  childViews: {}


  initialize: ->
    @render()
    @initUI()

  render: ->
    # $(document).title @model.get 'title'
    @$el.html @layoutTemplate @model.toJSON()
    @renderChilds()

  renderChilds: ->
    @childViews['header'] = new Tracktime.AppView.Header model: @model, container: @
    @childViews['main'] = new Tracktime.AppView.Main model: @model, container: @
    @childViews['footer'] = new Tracktime.AppView.Footer
      container: @
    @childViews['menu'] = new Tracktime.AppView.Menu
      container: @

  initUI: ->
    $.material.init()
    slideout = new Slideout
      'panel': $('#panel')[0]
      'menu': $('#menu')[0]
      'padding': 256
      'tolerance': 70
    $("#menuToggler").on 'click', () -> slideout.toggle()
    $("#isOnline").on 'change', (event) => @updateOnlineStatus(event)

  updateOnlineStatus: (event) ->
    @model.set 'isOnline', $(event.target).is(":checked")


(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

